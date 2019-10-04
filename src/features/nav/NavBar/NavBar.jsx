import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter} from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';
// import { logout } from '../../auth/authActions';



const mapStateToProps = (state) => ({
  //auth with redux state
  // auth:state.auth

  //auth with firebase
  auth:state.firebase.auth,
  //using profile to get user login profile details from firebase
  profile:state.firebase.profile

  
});

const mapDispatchToProps = {
  openModal
  // logout
}



class NavBar extends Component {


  handleSignIn = () => {
    this.props.openModal('LoginModal');
  }

  handleRegister = () => {

this.props.openModal('RegisterModal');
  }

  handleSignOut = () => {
    //loging out with firebase
     this.props.firebase.logout();
    //this.props.logout();
    this.props.history.push('/');
  }



    render() {

      const { auth, profile } = this.props;
      //auth with redux
      // const authenticated = auth.authenticated;

      //with firebase authentication
       const authenticated = auth.isLoaded && !auth.isEmpty;

        return (
          <Menu inverted fixed="top">
            <Container>
              <Menu.Item as={Link} to="/" header>
                <img src="/assets/logo.png" alt="logo" />
                Re-vents
              </Menu.Item>
              
              <Menu.Item as={NavLink} to="/events" name="Events" />

              {authenticated &&
              <Menu.Item as={NavLink} to="/people" name="People" />}

              {authenticated &&
              <Menu.Item>
                <Button 
                floated="right" 
                as={Link} 
                to="/createEvent" 
                positive
                inverted 
                content="Create Event" />


              </Menu.Item>}
              {authenticated ? (

                <SignedInMenu auth={auth} profile={profile} signOut={this.handleSignOut}/> 

                 ):( 

                <SignedOutMenu signIn={this.handleSignIn}  register={this.handleRegister}/>
                )}
            </Container>
          </Menu>
        )
    }
}

                            //withFirebase allow use to get access to firebase properties like authentication
export default withRouter(withFirebase(connect(mapStateToProps,mapDispatchToProps)(NavBar)));