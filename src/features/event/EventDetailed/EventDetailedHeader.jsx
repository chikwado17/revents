import React from 'react';
import { Segment, Image, Item, Button, Header, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';


const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};


const EventDetailedHeader = ({event, isGoing, isHost, goingToEvent, cancelGoingToEvent, loading, authenticated, openModal}) => {


  //coverting date
  let eventDate;
  if(event.date){
    eventDate = event.date.toDate();
  }

    return (

           <Segment.Group>
              <Segment basic attached="top" style={{ padding: '0' }}>
                <Image style={eventImageStyle} src="/assets/categoryImages/drinks.jpg" fluid />
        
                <Segment basic style={eventImageTextStyle}>
                  <Item.Group>
                    <Item>
                      <Item.Content>
                        <Header
                          size="huge"
                          content={event.title}
                          style={{ color: 'white' }}
                        />
                        <p>{format(eventDate, 'dddd Do MMMM')}</p>
                        <p>
                          Hosted by <strong>{event.hostedBy}</strong>
                        </p>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Segment>
              </Segment>
        
              <Segment attached="bottom">

              {/* isHost means if the current user is not the host then hide the buttons */}
              {!isHost &&
                <div>
                  {isGoing && !event.cancelled &&
                    <Button onClick={() => cancelGoingToEvent(event)}>Cancel My Place</Button> }

                   {!isGoing && authenticated && !event.cancelled &&
                    <Button onClick={() => goingToEvent(event)} loading={loading} color="teal">JOIN THIS EVENT</Button>}

                    {!authenticated && !event.cancelled &&
                    <Button onClick={() => openModal('UnauthModal')} loading={loading} color="teal">JOIN THIS EVENT</Button>}

                      {event.cancelled && !isHost &&
                      <Label size="large" color="red" content="This event has been cancelled"/>}
                </div>
              }
        

        {/* if the current user is the host it will display the manage event button */}
              {isHost &&
                <Button as={Link} to={`/manage/${event.id}`} color="orange">
                  Manage Event
                </Button>}
              </Segment>
            </Segment.Group>
    )
}

export default EventDetailedHeader
