import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Grid, Loader } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import { deleteEvent, getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';


//query firestore to get activity collection
//remember to pass the query down to firestoreconnect on footer code
const query = [
    {
        collection: 'activity',
        orderBy: ['timestamp', 'desc'],
        limit:5
    }
]



const mapStateToProps = (state) => ({
    
    //getting events from redux
    //   events:state.events,

    //getting events from firebase
    // events: state.firestore.ordered.events,
    
    //using firebase filtering 
    events: state.events,

    //checking if there is loading from asyncReducer before making use of the LoadingComponent
    loading:state.async.loading,
    //getting activities
    activities: state.firestore.ordered.activity
});

const mapDispatchToProps = {
    deleteEvent,
    getEventsForDashboard
}

class EventDashboard extends Component {

    state = {
        moreEvents: false,
        loadingInitial:true,
        loadedEvents: [],
        contextRef: {}
    }


    //getting events from firestore using filtering,sorting and pagnating
    async componentDidMount() {
       let next = await this.props.getEventsForDashboard();
       if(next && next.docs && next.docs.length > 1) {
           this.setState({
               moreEvents:true,
               loadingInitial:false,
               
           })
       }
    }

 //getting events from firestore using filtering,sorting and pagnating
    componentWillReceiveProps(nextProps) {
        if(this.props.events !== nextProps.events) {
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
            })
        }
    }


    //getting the last events from the limit(2) then also get the events after the last limit(2)
    getNextEvents = async () => {
        const { events } = this.props;

        let lastEvent = events && events[events.length -1];
       
        // then also get the events after the last limit(2)
        let next = await this.props.getEventsForDashboard(lastEvent);
       
        if(next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents:false
            })
        }

    }

    //handling contextref for sticky sementic react
    //remember pass down to eventactivity
    handleContextRef = (contextRef) => {
        this.setState({ contextRef })
    }

//deleting event with redux actions
    // handleDeleteEvent = (eventId) => () => {
    //     this.props.deleteEvent(eventId);
    // }


    render() {
        const { loading , activities} = this.props;
        const { moreEvents, loadedEvents } = this.state;
        if(this.state.loadingInitial) return <LoadingComponent inverted={true}/>
       

        return (
            
            <Grid>
                <Grid.Column width={10}>
                    <div ref={this.handleContextRef}>
                        <EventList 
                            events={loadedEvents}  
                            moreEvents={moreEvents}
                            getNextEvents={this.getNextEvents}
                            loading={loading}
                        />
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    
                    <EventActivity activities={activities} contextRef={this.state.contextRef}/>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active={loading}/>
                </Grid.Column>
            </Grid>
        )
    }
}
                                    //passing firestoreconnect as HOC to get access to our data on firebase                                                                                              
// export default connect(mapStateToProps,mapDispatchToProps)(
//     //listening to events collection on firebase database
//     firestoreConnect([{collection: 'events'}])(EventDashboard)
// );

export default connect(mapStateToProps,mapDispatchToProps)(
        //listening to events collection on firebase database
        firestoreConnect(query)(EventDashboard)
);