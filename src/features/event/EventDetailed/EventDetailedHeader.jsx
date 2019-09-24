import React from 'react';
import { Segment, Image, Item, Button, Header } from 'semantic-ui-react';
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


const EventDetailedHeader = ({event, isGoing, isHost, goingToEvent, cancelGoingToEvent, loading}) => {


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
                  {isGoing ? (
                    <Button onClick={() => cancelGoingToEvent(event)}>Cancel My Place</Button> ) : (
                   
                    <Button onClick={() => goingToEvent(event)} loading={loading} color="teal">JOIN THIS EVENT</Button>

                  )}
                </div>}
        

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
