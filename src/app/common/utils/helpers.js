import moment from 'moment';


//method for coverting object to an array
//use at eventListItem for firebase
export const objectToArray = (object) => {
    if(object){
        return Object.entries(object).map(e => Object.assign(e[1], {id: e[0]}))
    }
}



//creating new event for firestore
//this is for create newEvent inside the eventactions
export const createNewEvent = (user, photoURL, event) => {
    event.date = moment(event.date).toDate();
    return {
        ...event,
        hostUid:user.uid,
        hostedBy:user.displayName,
        hostPhotoURL:photoURL || 'assets/user.png',
        createdAt:Date.now(),
        attendees: {
            [user.uid]: {
                going:true,
                joinDate: Date.now(),
                photoURL:photoURL ||  'assets/user.png',
                displayName:user.displayName,
                host:true
            }
        }
    }
}



//datatree for chat reply
export const createDataTree = dataset => {
    let hashTable = Object.create(null);
    dataset.forEach(a => hashTable[a.id] = {...a, childNodes: []});
    let dataTree = [];
    dataset.forEach(a => {
        if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id]);
        else dataTree.push(hashTable[a.id])
    });
    return dataTree
};