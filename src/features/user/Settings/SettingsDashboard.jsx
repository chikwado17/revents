import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './PhotosPage';
import AccountPage from './AccountPage';
import { updatePassword, socialLogin } from '../../auth/authActions';

const mapDispatchToProps = {
    updatePassword,
    socialLogin
};

const mapStateToProps = (state) => ({
    //in this case of using providerId remember to add firebaseAuthIsReady at the index page to render only when auth is ready
    providerId: state.firebase.auth.providerData[0].providerId,
    //getting users profile from firebase profile
    user: state.firebase.profile
});


const SettingsDashboard = ({ updatePassword, providerId, socialLogin, user }) => {
    return (
        <Grid>
            <Grid.Column width={12}>
               <Switch>
                   <Redirect exact from="/settings" to="/settings/basics" />
                   
                   {/* using initialValues from redux form to display our initialValues down to BasicPage */}
                   <Route path="/settings/basics" render={() => <BasicPage  initialValues={user} />} />
                   <Route path="/settings/about" component={AboutPage} />
                   <Route path="/settings/photos" component={PhotosPage} />

                   {/* i have to render the AccountPage router before i can pass updatePassword as a props */} 
                   {/* providerId to check the method we used to login in then display only it at the accountPage */}
                   <Route path="/settings/account" render={()=> <AccountPage  updatePassword={updatePassword}  providerId={providerId} socialLogin={socialLogin} />} />
               </Switch>
            </Grid.Column>
            <Grid.Column width={4}>
                <SettingsNav/>
            </Grid.Column>
        </Grid>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDashboard);
