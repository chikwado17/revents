import React, { Component } from 'react'
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words';




class EventDetailedChat extends Component {

  state = {
    showReplyForm: false,
    selectedComment: null
  }

  handleReplyForm = (id) => () => {
    this.setState({
      showReplyForm: true,
      selectedComment: id
    })
  }

  handleCloseReplyForm = () => {
    this.setState({
      selectedComment:null,
      showReplyForm:false
    })
  }

  render() {
    const { eventChat, addEventComment, eventId  } = this.props;
    const { showReplyForm, selectedComment } = this.state;
    return (
      <div>
          <Segment
              textAlign="center"
              attached="top"
              inverted
              color="teal"
              style={{ border: 'none' }}
            >
              <Header>Chat about this event</Header>
            </Segment>
        
              <Segment attached>
                <Comment.Group>
                  {eventChat && eventChat.map((comment) => (
                    <Comment key={comment.id}>
                      <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${comment.uid}`}>{comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{distanceInWords(comment.date, Date.now())} ago</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.text}</Comment.Text>
                        <Comment.Actions>
                          <Comment.Action onClick={this.handleReplyForm(comment.id)}>Reply</Comment.Action>
                          {showReplyForm && selectedComment === comment.id &&
                            <EventDetailedChatForm 
                            form={`reply_${comment.id}`} 
                            addEventComment={addEventComment} 
                            eventId={eventId}
                            closeForm={this.handleCloseReplyForm}
                            />
                          }
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  ))}
                  
           
                </Comment.Group> 
                <EventDetailedChatForm form={`newComment`} addEventComment={addEventComment} eventId={eventId}/>
              </Segment>
      </div>
    )
  }
}
export default EventDetailedChat;