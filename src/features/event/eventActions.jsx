import { toastr } from 'react-redux-toastr';
import { asyncActionStart,asyncActionFinish,asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/utils/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';


//creating event with firestore
export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        //getting login user profile photo
        const photoURL = getState().firebase.profile.photoURL;
        let newEvent = createNewEvent(user, photoURL, event);
        try{
          let createdEvent = await firestore.add(`events`,newEvent);
          //creating a subcollections for event attendees
          await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`,{
            eventId: createdEvent.id,
            userUid:user.uid,
            eventDate:event.date,
            host:true
          })
            toastr.success("Success", "Event has been created");
        }catch(error){
            toastr.error("Opps!!!", "Error occured creating an event");
        }
    }
};


//without toaster
// export const updateEvent = (event) => ({
//     type: 'UPDATE_EVENT',
//     event
// });

//updating event in redux
// export const updateEvent = (event) => {
//     return async dispatch => {
//         try{
//             dispatch({
//                 type: 'UPDATE_EVENT',
//                 event
//             });
//             toastr.success("Success", "Event has been updated");
//         }catch(error){
//             toastr.error("Opps!!!", "Error occured updating an event");
//         }
//     }
// };


//updating event in firestore
export const updateEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        if(event.date !== getState().firestore.ordered.events[0].date){
            event.date = moment(event.date).toDate();
        }
        try{
           await firestore.update(`events/${event.id}`, event)
            toastr.success("Success", "Event has been updated");
        }catch(error){
            toastr.error("Opps!!!", "Error occured updating an event");
        }
    }
};


//action to cancel event
export const cancelToggle = (cancelled, eventId) => {
    return async (dispatch, getState, {getFirestore})=> {
        const firestore = getFirestore();
        const message = cancelled ? 'Are you sure you want to cancel the event?' 
        : 'This will reactivate the event - are you sure?';

        try{
            toastr.confirm(message, {
                onOk: () => firestore.update(`events/${eventId}`, {
                    cancelled:cancelled
                })
            })   
        }catch(error){
            console.log(error);
        }
    }
}






//without toaster
// export const deleteEvent = (eventId) => ({
//     type: 'DELETE_EVENT',
//     eventId
// });

export const deleteEvent = (eventId) => {
    return async dispatch => {
        try{
            dispatch({
                type: 'DELETE_EVENT',
                eventId
            });
            toastr.success("Success", "Event has been deleted");
        }catch(error){
            toastr.error("Opps!!!", "Error occured deleting an event");
        }
    }
};



//action -> for filtering events on firebase.

export const getEventsForDashboard = (lastEvent) => {
    return async (dispatch, getState) => {
        let today = new Date(Date.now());
        const firestore = firebase.firestore();
        const eventsRef = firestore.collection('events');
      

        try{
            dispatch(asyncActionStart());
            let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get();
            let query;

//filtering events by date
            lastEvent ? query = eventsRef
            .where('date', '>=', today)
            .orderBy('date').startAfter(startAfter)
            .limit(2)

            :   query = eventsRef
            .where('date', '>=', today)
            .orderBy('date').limit(2) 
            
            let querySnap = await query.get();


            // checck if there is no event if there is no event then break/stop
            if(querySnap.docs.length === 0){
                dispatch(asyncActionFinish());
                return querySnap;
            }

            let events = [];

            //looping through the querysnapshot
                for(let i = 0; i < querySnap.docs.length; i++){
                    let evt = {...querySnap.docs[i].data(), id: querySnap.docs[i].id};
                    events.push(evt);
                }
                
            dispatch({
                type: "FETCH_EVENTS",
                events
            });
            dispatch(asyncActionFinish());

            return querySnap;

        }catch(error){
            console.log(error);
            dispatch(asyncActionError());
        }
    }
}



//adding comment/chat to firebase
export const addEventComment = (eventId, values) => {
    return async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        //getting logged in user profile
        const profile = getState().firebase.profile;
        //getting current logged in user id.
        const user = firebase.auth().currentUser;

        let newComment = {
            displayName:profile.displayName,
            photoURL: profile.photoURL || 'assets/user.png',
            uid:user.uid,
            text:values.comment,
            date: Date.now()
        }
        try{
            await firebase.push(`event_chat/${eventId}`, newComment);
        }catch(error){
            console.log(error);
            toastr.error('Oops!', 'Error sending comment');
        }
    }
}