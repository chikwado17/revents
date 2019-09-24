import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import  { Grid } from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { objectToArray, createDataTree } from '../../../app/common/utils/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';


//checking if there is events from firestore then populate it to our page
const mapStateToProps = (state, ownProps) => {
    let event = {};

        if(state.firestore.ordered.events && state.firestore.ordered.events[0]){
            event =  state.firestore.ordered.events[0];   
        }

    return {
        event,
        loading: state.async.loading,
        auth: state.firebase.auth,
                                                                            //passing it to the current event chat.
        eventChat: !isEmpty(state.firebase.data.event_chat) && objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
    }

}


const mapDispatchToProps = {
    goingToEvent,
    cancelGoingToEvent,
    addEventComment
}

class EventDetailedPage extends Component {


    //method for getting event from firestore
    //database get request
    async componentDidMount() {
        const { firestore, match } = this.props;
        await firestore.setListener(`events/${match.params.id}`);    
    }
    async componentWillUnmount() {
        const { firestore, match } = this.props;
        await firestore.unsetListener(`events/${match.params.id}`);    
    }

    render() {
        const {loading, event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;
        //using the convered object to array for attendees
        const attendees = event && event.attendees && objectToArray(event.attendees);
        const isHost = event.hostUid === auth.uid;
        const isGoing = attendees && attendees.some((a) =>a.id === auth.uid);
        
        //sorting event chat to have its own reply assigned to it
        const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);


        return (
            <Grid>
                <Grid.Column  width={10}>
                    <EventDetailedHeader loading={loading} event={event}  isHost={isHost} isGoing={isGoing} goingToEvent={goingToEvent} cancelGoingToEvent={cancelGoingToEvent} />
                    <EventDetailedInfo event={event}/>
                    <EventDetailedChat addEventComment={addEventComment} eventId={event.id}  eventChat={chatTree} />
                </Grid.Column>

                <Grid.Column  width={6}>
                    <EventDetailedSidebar attendees={attendees} />
                </Grid.Column>
            </Grid>
        )
    }
}



export default compose(
    withFirestore,
    connect(mapStateToProps,mapDispatchToProps),
    //listing to firebase for event_chat and the id of the event
    firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
)(EventDetailedPage);
