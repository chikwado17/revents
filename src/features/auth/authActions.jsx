import { SubmissionError, reset } from 'redux-form';
import { closeModal } from '../modals/modalActions';
import { toastr } from 'react-redux-toastr';

//login authentication without firebase
// export const login = (creds) => {
//   return dispatch => {
//       dispatch({type:'LOGIN_USER',creds})
//       dispatch(closeModal())
//   }
// };


//login authentication using email and password for firebase
export const login = (creds) => {
  return async (dispatch, getState, { getFirebase }) => {

      const firebase = getFirebase();

      try {
        await firebase.auth().signInWithEmailAndPassword(creds.email,creds.password);
        dispatch(closeModal());
      }catch (error) {
        console.log(error);
        //sending auth error message for login form with the help of SubmissionError
        throw new SubmissionError({
          _error: "Login Failed!!!"
        })
      }
      
  }
};

// export const logout = () => ({
//     type: 'SIGN_OUT_USER'
// });


export const registerUser = (user) => {
  return async (dispatch, getState, {getFirebase, getFirestore}) => {

    const firebase = getFirebase();
    const firestore = getFirestore();

    try {

      //create the user in auth
      let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email,user.password);
      //update the auth profile
      await createdUser.updateProfile({
        displayName: user.displayName
      });
      //create a new users collection in firestore for users
      let newUser = {
        displayName: user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp()
      }

await firestore.set(`users/${createdUser.uid}`, {...newUser})
dispatch(closeModal());

    }catch (error) {
      console.log(error);
      //sending auth error message for login form with the help of SubmissionError
      throw new SubmissionError({
        _error: error.message
      })
    }
  }
}


export const socialLogin = (selectedProvider) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    try {
      dispatch(closeModal());
    let user = await firebase.login({
        provider:selectedProvider,
        type:'popup'
      });

      if(user.additionalUserInfo.isNewUser) {
        await firestore.set(`users/${user.user.uid}`, {
          displayName: user.profile.displayName,
          photoURL: user.profile.avatarUrl,
          createdAt: firestore.FieldValue.serverTimestamp()
        })

      }
    }catch(error) {

      console.log(error);
    }
  }
}



export const updatePassword = (creds) => {
  return async (dispatch, getState, {getFirebase}) => {

    const firebase = getFirebase();
    const user = firebase.auth().currentUser;

    try {

      await user.updatePassword(creds.newPassword1);
      //we new to reset our form before we can update the new password
      //we need to import reset from redux-form and pass it the name of the form we want to reset in this case account is the name of the form
      await dispatch(reset('account'));
      toastr.success("Successful", "Your password has been updated");
      
    }catch(error) {

      throw new SubmissionError({
        _error: error.message
      })

    }
  }
}