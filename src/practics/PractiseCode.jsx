  //updating event without redux actions
    //this function will update any selected events
    // handleUpdateEvent = (eventToUpdate) => {
    //   this.setState({
    //     events:this.state.events.map((event) => {
    //       if(event.id === eventToUpdate.id){
    //         //the object assign will clone and replace the event to be updated with the new one.
    //         return Object.assign({}, eventToUpdate)
    //       }else{
    //         //if the event to update does not match the selected event to update return back the event.
    //         return event
    //       }
    //     }),
    //     isOpen:false,
    //     selectedEvent:null
    //   })
    // }



    //this method will add or will update the new event added from the form.
    // handleCreateEvent = (newEvent) => {
    //     //generating random id
    //     newEvent.id = cuid();
    //     newEvent.hostPhotoURL = '/assets/user.png';

    //     //passing the old events and the new events to updatedEvents.  passed down to EventForm
    //     const updatedEvents = [...this.state.events, newEvent];
    //     this.setState({
    //         events: updatedEvents,
    //         isOpen:false
    //     })
    // }


     //delete event without redux action
    // //this will delete any selected event.
    // handleDeleteEvent = (eventId) => () => {
    //   const updatedEvent = this.state.events.filter(e => e.id !== eventId);
    //     this.setState({
    //       events:updatedEvent
    //     })
    // }




      // //this renders immediately when is page is loaded
    // // this will show the data of a selected event
    // componentDidMount() {
    //   if(this.props.selectedEvent !== null){
    //     this.setState({
    //       event:this.props.selectedEvent
    //     })
    //   }
    // }



     // //this renderes after the page has been rendered
    // //checking if the new selected event is not equal to the selected event or if the event is empty.
    // componentWillReceiveProps(nextProps) {
    //   if(nextProps.selectedEvent !== this.props.selectedEvent){
    //     this.setState({
    //       event: nextProps.selectedEvent || emptyEvent
    //     })
    //   }
    // }


    // handleFormChange = (evt) => {
    //     const newEvents = this.state.event;
    //     newEvents[evt.target.name] = evt.target.value;
    //     this.setState({
    //         event:newEvents
    //     })
    // }


////////////////////////////////////////////////////////////////////////////////////////////////////

    //to fetch event from mockapi
//adding toastr to event actions
// export const fetchEvent = ({ events } = {} ) => {
//     return {
//         type: "FETCH_EVENTS",
//         events
//     }
// };


//without toaster
// export const createEvent = (event) => ({
//     type: 'CREATE_EVENT',
//     event
// });

//creating event with redux
// export const createEvent = (event) => {
//     return async dispatch => {
//         try{
//             dispatch({
//                 type: 'CREATE_EVENT',
//                 event
//             });
//             toastr.success("Success", "Event has been created");
//         }catch(error){
//             toastr.error("Opps!!!", "Error occured creating an event");
//         }
//     }
// };



//to load our events using redux thunk to add a delay before our events will display
// export const loadEvents = () => {
//     return async dispatch => {
//         try {
//             dispatch(asyncActionStart());

//             let events = await fetchSampleData();

//             dispatch(fetchEvent(events));

//             dispatch(asyncActionFinish());
//         }catch(error){
//             console.log(error);

//             dispatch(asyncActionError());
//         }
//     }
// }

/////////////////////////////////////////////////////////////////////////////

// import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase';


//action -> for filtering events on firebase.
//filtering events by date
// export const getEventsForDashboard = () => {
//   return async (dispatch, getState) => {
//       let today = new Date(Date.now());
//       const firestore = firebase.firestore();
//       const eventsQuery = firestore.collection('events').where('date', '>=', today);
    

//       try{
//           dispatch(asyncActionStart());
//           const querySnap = await eventsQuery.get();
          
//           let events = [];

//           //looping through the querysnapshot
//               for(let i = 0; i < querySnap.docs.length; i++){
//                   let evt = {...querySnap.docs[i].data(), id: querySnap.docs[i].id};
//                   events.push(evt);
//               }
              
//           dispatch({
//               type: "FETCH_EVENTS",
//               events
//           });
//           dispatch(asyncActionFinish());
//       }catch(error){
//           console.log(error);
//           dispatch(asyncActionError());
//       }
//   }
// }