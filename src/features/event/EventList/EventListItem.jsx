import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import EventListAttendee from './EventListAttendee';
import format from 'date-fns/format';
import { objectToArray } from '../../../app/common/utils/helpers';



class EventListItem extends Component {
    render() {
      const { events } = this.props;
        return (
             <Segment.Group>
                <Segment>
                  <Item.Group>
                    <Item>
                      <Item.Image size="tiny" circular src={events.hostPhotoURL} />
                      <Item.Content>
                        <Item.Header as={Link} to={`/events/${events.id}`}>{events.title}</Item.Header>
                        <Item.Description>
                          Hosted by <Link to={`profile/${events.hostUid}`}>{events.hostedBy}</Link>
                        </Item.Description>
                        
                        {/* for the cancelled event labels */}
                        {events.cancelled &&
                        <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled' />}
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Segment>
                <Segment>
                  <span>
                    {/* additing format for date-fns/format is to format date */}
                    <Icon name="clock" /> {format(events.date.toDate(), 'dddd Do MMMM')} at {format(events.date.toDate(), 'HH:mm')} |
                    <Icon name="marker" /> {events.venue} | {events.city}
                  </span>
                </Segment>
                <Segment secondary>
                  <List horizontal>
                    {events.attendees && objectToArray(events.attendees).map((attendee) => (

                                                     //passing attendee as props to EventListAttendee
                      <EventListAttendee key={attendee.id}     attendee={attendee}/>


                    ))}
                  </List>
                </Segment>
                <Segment clearing>
                    <span>{events.description}</span>


                  {/* <Button as="a" onClick={deleteEvent(events.id)} color="red" floated="right" content="Delete" /> */}
                  <Button as={Link} to={`/event/${events.id}`} color="teal" floated="right" content="View" />
                </Segment>
              </Segment.Group>
        )
    }
}
export default EventListItem;