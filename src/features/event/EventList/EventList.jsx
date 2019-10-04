import React, { Component } from 'react';
import EventListItem from './EventListItem';
import InfinitScroll from 'react-infinite-scroller';

class EventList extends Component {
    render() {
        const { events, deleteEvent, loading, getNextEvents, moreEvents } = this.props;
        return (
            <div>
                {events && events.length !== 0 && (
                    <InfinitScroll
                        pageStart={0}
                        loadMore={getNextEvents}
                        hasMore={!loading && moreEvents}
                        initialLoad={false}
                    >
                        {events && events.map((event) => (
                                    /* passing events to EventListItem */        //from eventdashboard                      
                            <EventListItem key={event.id} events={event}  deleteEvent={deleteEvent}/>
                        ))}
                    </InfinitScroll> 
                )}  
            </div>
        )
    }
}

export default EventList;