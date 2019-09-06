
export const UserDetailedQueries = ({auth, userUid}) => {

    if(userUid !== null){

        //setting and getting informations/profiles of other users that is not logged in
        return [
            {
                collection: 'users',
                doc:userUid,
                storeAs:'profile'

            }, 
            {
                collection:'users',
                doc:userUid,
                subcollections:[{collection:'photos'}],
                storeAs:'photos'
            }
        ]
    }else {
        //return the profile of the current logged in user profile,
        //quering firestore to get photo
        
        return [
            {
               collection:'users',
               doc:auth.uid,
               subcollections:[{collection:'photos'}],
               storeAs:'photos' 
            }
        ]
    }
    
};
