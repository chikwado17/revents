/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import { combineValidators, composeValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form , Button, Grid, Header } from 'semantic-ui-react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';


const mapDispatchToProps = {
  createEvent,
  updateEvent,
  cancelToggle
}




const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];


//adding validation message for our redux form
//pass the validate down to export default EventForm reduxForm initialization
const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired({message: 'Please provide a category'}),
  description: composeValidators(
    isRequired({message: 'Please enter a description'}),
    hasLengthGreaterThan(4)({message: 'Description needs at least 5 characters'})
  )(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')
});


//retriveing our initialdata from firestore to display on your form for editing/updating
const mapStateToProps = (state) => {
  let event = {};

  if(state.firestore.ordered.events && state.firestore.ordered.events[0]){
      event =  state.firestore.ordered.events[0];   
  }

  return {
    //reduxForm has access to initial values which will populate the intial values to our form field.
   initialValues:event,
   event
  }

}

class EventForm extends Component {

          state = {
            cityLatLng: {},
            venueLatLng: {},
            scriptLoaded: false
          }




        handleScriptLoaded = () => {
            this.setState({
                scriptLoaded: true
            })
        }
    
        handleCitySelect = (selectedCity) => {
            geocodeByAddress(selectedCity)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                this.setState({
                    cityLatLng:latlng
                });
            })
            .then(() => {
                this.props.change('city', selectedCity)
            })
        }
    
        handleVenueSelect = (selectedVenue) => {
            geocodeByAddress(selectedVenue)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                this.setState({
                    venueLatLng:latlng
                });
            })
            .then(() => {
                this.props.change('venue', selectedVenue)
            })
        }




    onFormSubmit = (values)  => {

       //for venue input form field.
       values.venueLatLng = this.state.venueLatLng;

        //this will check if initialvalues.id matched the selected event to update. then update
        //the initialvalues coming from redux form property
        if(this.props.initialValues.id){
          this.props.updateEvent(values);
          this.props.history.goBack();
        }else{
          //creating new event using firestore action createEvent
          this.props.createEvent(values);
          this.props.history.push('/events')
        }
        
    }


     //method for getting event from firestore
    //database get request
    async componentDidMount() {
        const { firestore, match} = this.props;
        await firestore.setListener(`events/${match.params.id}`);
        
    }
    async componentWillUnmount() {
      const { firestore, match} = this.props;
      await firestore.unsetListener(`events/${match.params.id}`);
      
    }




    render() {
     
      const { invalid, submitting, prestine, event, cancelToggle } = this.props;
        return (

          <Grid>
          <Script
            url="https://maps.googleapis.com/maps/api/js?key=AIzaSyC2g6dnrgufku9FR16xf1h93frUchAXBkM&libraries=places"
            onLoad={this.handleScriptLoaded}
                />
            <Grid.Column width={10}>
              <Segment>
                <Header sub color="teal" content="Event Details"/>

                {/* the handleSubmit coming from redux form property to handle submitting of form */}
                <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>

                      <Field name="title" type="text" component={TextInput} placeholder="Give your event a name" />
                      <Field name="category" options={category} type="text" component={SelectInput} placeholder="What is your event about?" />
                      <Field name="description" type="text" rows={3} component={TextArea} placeholder="Tell us about your event" />

                      <Header sub color="teal" content="Event Location Details"/>
                      <Field name="city" options={{ types: ['(cities)'] }} type="text" component={PlaceInput} placeholder="City of the Event" onSelect={this.handleCitySelect}/>

                      {this.state.scriptLoaded && <Field name="venue" options={{location: new google.maps.LatLng(this.state.cityLatLng), radius:1000, types: ['establishment']}} type="text" component={PlaceInput} onSelect={this.handleVenueSelect} placeholder="Venue of the Event"  />}


                      <Field 
                      name="date" 
                      type="text" 
                      component={DateInput} 
                      placeholder="Date and Time for the Event"
                      dateFormat="YYYY-MM-DD HH:mm"
                      timeFormat='HH:mm'
                      showTimeSelect 
                      />


                    <Button disabled={invalid || submitting || prestine} positive type="submit">
                      Submit
                    </Button>
                    <Button onClick={ this.props.history.goBack} type="button">Cancel</Button>

                    <Button
                      onClick={() => cancelToggle(!event.cancelled, event.id)}
                      type='button'
                      color={event.cancelled ? 'green' : 'red'}
                      floated='right'
                      content={event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
                    />
                    
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        )
    }
}
                                                                                //enableReinitialize helps the reduxform to re-render the form inputs
export default withFirestore(connect(mapStateToProps,mapDispatchToProps)(reduxForm({form: "eventForm", enableReinitialize:true, validate}) (EventForm)));