import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import format from 'date-fns/format';



const EventDetailedInfo = ({event}) => {

  //coverting date
  let eventDate;
  if(event.date){
    eventDate = event.date.toDate();
  }
  
    return (
        <div>
              <Segment.Group>
                 <Segment attached="top">
                   <Grid>
                     <Grid.Column width={1}>
                       <Icon size="large" color="teal" name="info" />
                     </Grid.Column>
                     <Grid.Column width={15}>
                       <p>{event.description}</p>
                     </Grid.Column>
                   </Grid>
                 </Segment>
                 <Segment attached>
                   <Grid verticalAlign="middle">
                     <Grid.Column width={1}>
                       <Icon name="calendar" size="large" color="teal" />
                     </Grid.Column>
                     <Grid.Column width={15}>
                       <span>{format(eventDate, 'dddd Do MMM')} at {format(eventDate, 'h:mm A')}</span>
                     </Grid.Column>
                   </Grid>
                 </Segment>
                 <Segment attached>
                   <Grid verticalAlign="middle">
                     <Grid.Column width={1}>
                       <Icon name="marker" size="large" color="teal" />
                     </Grid.Column>
                     <Grid.Column width={11}>
                       <span>{event.venue}</span>
                     </Grid.Column>
                     
                   </Grid>
                 </Segment>
               </Segment.Group>
        </div>
    )
}

export default EventDetailedInfo
