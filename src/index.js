import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import { configureStore }from './app/store/configureStore';
import ScrollToTop from './app/common/utils/ScrollToTop';
// import { loadEvents } from './features/event/eventActions';

const store = configureStore();

//to load the events using a call to dispatch
// store.dispatch(loadEvents());



const rootEl = document.getElementById('root');

let render = () => {

    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop>
                <ReduxToastr
                    newestOnTop={false}
                    preventDuplicates
                    position="bottom-right"
                    transitionIn="fadeIn"
                    transitionOut="fadeOut"
                    closeOnToastrClick
                />
                    <App/>
                </ScrollToTop>
            </BrowserRouter>
        </Provider>,
        rootEl);

}

if(module.hot){
    module.hot.accept('./app/layout/App',() => {
        setTimeout(render);
    });
}


//only when firebase authentication is ready then ready the page..
store.firebaseAuthIsReady.then(() => {
    render();
});





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
