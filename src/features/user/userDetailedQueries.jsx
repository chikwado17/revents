//for userdetailed page
export const UserDetailedQueries = ({auth, userUid, match}) => {

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
            },
            {
                //quering following collection
                collection: 'users',
                doc: auth.uid,
                subcollections: [{ collection: 'following', doc: match.params.id }],
                storeAs: 'following'

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
