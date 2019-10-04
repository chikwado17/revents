import React, {Component} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toastr } from 'react-redux-toastr';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import {Button, Tab, Card, Grid, Header, Icon, Image, Item, List, Segment} from "semantic-ui-react";
import format from 'date-fns/format';
import differenceInYears from 'date-fns/difference_in_years';
import { Link } from 'react-router-dom';
import { UserDetailedQueries } from '../userDetailedQueries';
import LazyLoad from 'react-lazyload';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents, followUser, unfollowUser } from '../userActions';



const panes = [
    {menuItem: 'All Events', pane: {key: 'allEvents'}},
    {menuItem: 'Past Events', pane: {key: 'pastEvents'}},
    {menuItem: 'Future Events', pane: {key: 'futureEvents'}},
    {menuItem: 'Hosting', pane: {key: 'hosted'}},
    
]


const mapDispatchToProps = {
    getUserEvents,
    followUser,
    unfollowUser
}

const mapStateToProps = (state,ownProps) => {
    let userUid = null;
    let profile = {};

    if(ownProps.match.params.id === state.auth.uid){
        //get from the current login user
        profile = state.firebase.profile
    }else{
        //if not the current login user then set this to the other users
        //getting other users profile that is not login as the current user
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
        userUid = ownProps.match.params.id;
    }
    return {

        profile,
        userUid,
        //auth to query firestore 
        auth:state.firebase.auth, 
        photos:state.firestore.ordered.photos,
        requesting: state.firestore.status.requesting,
        //for filtering past,future and host event
        events:state.events,
        eventLoading:state.async.loading,
        following: state.firestore.ordered.following
    }
};



class UserDetailedPage extends Component {


    async componentDidMount() {

        //checking if a user exists else push to 404 error page
        let user = await this.props.firestore.get(`users/${this.props.match.params.id}`);

        if(!user.exists){
            toastr.error('NOT FOUND', 'This is not the user you are looking for');
            this.props.history.push('/error');
        }
        await this.props.getUserEvents(this.props.userUid);
        
    }


    changeTab = (e, data) => {
        this.props.getUserEvents(this.props.userUid, data.activeIndex)
    }

    render() {
        const { profile, photos, auth, match, requesting, events, eventLoading, followUser, following, unfollowUser  } = this.props;
        //if the current authentication matches the auth params id
        const isCurrentUser = auth.uid === match.params.id;

        //loading component from checking requesting status from firestore status
        const loading = requesting[`users/${match.params.id}`]

        const isFollowing = !isEmpty(following)




        if(loading) return <LoadingComponent inverted={true} />

//for age
        let age;
            if(profile.dateOfBirth){
                age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
            }else{
                age = 'unknown age';
            }
//for createdAt
            let createdAt;
            if(profile.createdAt){
                createdAt = format(profile.createdAt.toDate(), 'dddd Do MMMM');
            }else{
                createdAt = 'unknown'
            }

        return (
            <Grid>
                <Grid.Column width={16}>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'}/>
                                <Item.Content verticalAlign='bottom'>
                                    <Header as='h1'>{profile.displayName}</Header>
                                    <br/>
                                    <Header as='h3'>{profile.occupation}</Header>
                                    <br/>
                                    <Header as='h3'>{age}, {profile.city || 'unknown'}</Header>
                                </Item.Content>
                            </Item>
                        </Item.Group>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column width={10}>
                                <Header icon='smile' content='About Display Name'/>
                                <p>I am a: <strong>{profile.occupation || 'btn'}</strong></p>
                                <p>Originally from <strong>{profile.origin || 'btn'}</strong></p>
                                <p>Member Since: <strong> {createdAt} </strong></p>
                                <p>{profile.about || 'unknown'}</p>

                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header icon='heart outline' content='Interests'/>

                                {/* displaying the user interest stored on firestore */}
                                {profile.interests ?
                                <List>
                                    {profile.interests && profile.interests.map((interest,index) => (
                                        <Item key={index}>
                                            <Icon name='heart'/>
                                            <Item.Content>{interest}</Item.Content>
                                        </Item> 
                                    ))}
                                </List>: <p>No Interest</p> }
                               


                            </Grid.Column>
                        </Grid>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}>


                    <Segment>
                        {/* checking if it the currentuser the assign follow us or edit profile */}
                        {isCurrentUser && (
                            <Button color='teal' as={Link} to={'/settings'} fluid basic content='Edit Profile'/> 
                        )}
                            
                        {/*passing profile to followUSer to get details of the user his following */}
                        {!isCurrentUser && !isFollowing &&
                            
                            <Button 
                                onClick={() => followUser(profile)} 
                                color='teal'  
                                fluid basic 
                                content='Follow User'/>
                        }

                        {!isCurrentUser && isFollowing &&
                            <Button 
                                onClick={() => unfollowUser(profile)} 
                                color='teal'  
                                fluid basic 
                                content='UnFollow'/>
                        }

                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached>
                        <Header icon='image' content='Photos'/>

                        {/* displaying user photos store on firestore */}
                        <Image.Group  size='small'>
                            {photos && photos.map(photo => (
                                <LazyLoad key={photo.id} height={150} placeholder={<Image src='/assets/user.png' />}>  
                                    <Image src={photo.url} /> 
                                </LazyLoad> 
                            ))}
                        </Image.Group>
                        


                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached loading={eventLoading}>
                        <Header icon='calendar' content='Events'/>
                       <Tab onTabChange={(e,data) => this.changeTab(e,data)} panes={panes} menu={{secondary:true, pointing:true}}/>
                        <br/>


                        <Card.Group itemsPerRow={5}>
                                    {events && events.map((event) => (
                                        <Card as={Link} to={`/event/${event.id}`} key={event.id}>
                                            <Image src={`/assets/categoryImages/${event.category}.jpg`}/>
                                            <Card.Content>
                                                <Card.Header textAlign='center'>
                                                    {event.title}
                                                </Card.Header>
                                                <Card.Meta textAlign='center'>
                                                   <div>{format(event.date && event.date.toDate(), 'DD MMM YYYY')}</div>
                                                   <div>{format(event.date && event.date.toDate(), 'h:mm A')}</div>
                                                </Card.Meta>
                                            </Card.Content>
                                        </Card>
                                    ))}
                        </Card.Group>
                    </Segment>
                </Grid.Column>
            </Grid>

        );
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    firestoreConnect((auth, userUid, match) => UserDetailedQueries(auth, userUid, match))
)(UserDetailedPage);