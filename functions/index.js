const functions = require('firebase-functions');

//creating firebase admin to have full access of the app
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


const newActivity = (type, event, id) => {
    return {
            type: type,
            eventDate: event.date,
            hostedBy: event.hostedBy,
            title: event.title,
            photoURL:event.hostPhotoURL,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            hostUid: event.hostUid,
            eventId: id
    }
}


//creating activity for new created events
exports.createActivity = functions.firestore
    .document('events/{eventId}')
    .onCreate(event => {
        //getting new created event data
        let newEvent = event.data();
        console.log(newEvent);

        const activity = newActivity('newEvent', newEvent, event.id)
        console.log(activity);

        //creating new collection on database called activity
        return admin.firestore().collection('activity')
            .add(activity)
            .then((docRef) => {
                return console.log('Activity created with ID: ', docRef.id);
            })
            .catch((err) => {
                return console.log("Error adding activity", err);
            })
})



//creating activity for cancelled events
exports.cancelActivity = functions.firestore.document('events/{eventId}').onUpdate((event, context) => {
        let updatedEvent = event.after.data();
        let previousEventData = event.before.data();
        console.log({event});
        console.log({context});
        console.log({updatedEvent});
        console.log({previousEventData})

        if(!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled) 
        return false;
        
        const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId );

        console.log({activity})

        //creating new collection on database called activity
        return admin.firestore().collection('activity')
            .add(activity)
            .then((docRef) => {
                return console.log('Activity created with ID: ', docRef.id);
            })
            .catch((err) => {
                return console.log("Error adding activity", err);
            })
});



////////////////////////////////////////////////////////////



exports.userFollowing = functions.firestore
    .document('users/{followerUid}/following/{followingUid}')
    .onCreate((event, context) => {
        console.log('v1');

        //getting the id of the current user,  that is following someone
        const followerUid = context.params.followerUid;
        //getting id of the person the current user is following
        const followingUid = context.params.followingUid;

        //getting the document of the current user that want to follow someone
        const followerDoc = admin
            .firestore()
            .collection('users')
            .doc(followerUid)

        console.log(followerDoc);

        //getting the details of the follower to the new created subcollection
        return followerDoc.get().then((doc) => {
            let userData = doc.data();
            console.log({ userData });

            let follower = {
                displayName: userData.displayName,
                photoURL: userData.photoURL || '/assets/user.png',
                city: userData.city || 'unknown city'
            };

            return admin.firestore()
            .collection('users')
            .doc(followingUid)
            .collection('followers')
            .doc(followerUid)
            .set(follower)
        })
    })


    exports.unfollowUser = functions.firestore
        .document('users/{followerUid}/following/{followingUid}')
        .onDelete((event, context) => {
            return admin
                .firestore()
                .collection('users')
                .doc(context.params.followingUid)
                .collection('followers')
                .doc(context.params.followerDoc)
                .delete()
                .then(() => {
                    return console.log('doc deleted');
                }).catch(err => {
                    return console.log(err);
                })
        })