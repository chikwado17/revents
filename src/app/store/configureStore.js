import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import firebase from '../config/firebase';


//configuring react-redux-firebase telling it were we are storing user profile,
//using attachAuthIsReady means we need to know when authentication is avaliable for use to use. setting it to true.
// setting profile to firestore as useFirestoreForProfile
const rrfConfig = {

    userProfile: 'users',
    attachAuthIsReady:true,
    useFirestoreForProfile:true,
    updateProfileOnLogin:false
}



export const configureStore = (preloadedState) => {
//adding getfirebase and firestore to redux-thunk with the help of withExtraArgument
    const middlewares = [thunk.withExtraArgument({ getFirebase,getFirestore })];
    const middlewaresEnhancer = applyMiddleware(...middlewares);

    const storeEnhancers = [middlewaresEnhancer];
//in componsedEnhancer we need to add reactreduxfirebase and reactreduxfirestore configuration which is rrfconfig
    const composedEnhancer = composeWithDevTools(

        ...storeEnhancers, 
        reactReduxFirebase(firebase, rrfConfig),
        reduxFirestore(firebase)

    );

    const store = createStore(
        rootReducer,
        preloadedState,
        composedEnhancer
    );

    //for hot loading / hot refreshing of browser
    if(process.env.NODE_ENV !== 'production'){
        if(module.hot){
            module.hot.accept('../reducers/rootReducer',() => {
                const newRootReducer = require('../reducers/rootReducer').default;
                store.replaceReducer(newRootReducer);
            })
        }
    }

    return store;
}