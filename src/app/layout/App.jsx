import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import HomePage from '../../features/home/HomePage';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import EventForm from '../../features/event/EventForm/EventForm';
import NavBar from '../../features/nav/NavBar/NavBar';
import ModalManager from '../../features/modals/ModalManager';
import { UserIsAuthenticated } from '../../features/auth/authWrapper';




class App extends Component {
  render() {
    return (
      <div>
      <ModalManager/>
        <Switch>
          <Route path="/" component={HomePage} exact={true}/>
        </Switch> 
        {/* Conditional rendering navbar */}
        <Route 
          path="/(.+)" 
          render={() => (
          <div> 
              <NavBar/>
              <Container className="main">
                <Switch>
                    <Route path="/events" component={EventDashboard}/>
                    <Route path="/event/:id" component={EventDetailedPage} />
                    <Route path="/manage/:id" component={UserIsAuthenticated(EventForm)} />
                    <Route path="/people" component={UserIsAuthenticated(PeopleDashboard)}/>
                    <Route path="/profile/:id" component={UserIsAuthenticated(UserDetailedPage)}/>
                    <Route path="/settings" component={UserIsAuthenticated(SettingsDashboard)}/>
                    <Route path="/createEvent" component={UserIsAuthenticated(EventForm)}/>
                </Switch> 
              </Container>
          </div>
        )}
        />
      </div> 
    );
  }
}

export default App;