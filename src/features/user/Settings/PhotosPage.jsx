import React, {Component} from 'react';
import {connect} from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { toastr } from 'react-redux-toastr';
import {Image, Segment, Header, Divider, Grid, Button, Card, Icon} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions';




//quering firestore to get photo
const query = ({auth}) => {

    return [
        {
           collection:'users',
           doc:auth.uid,
           subcollections:[{collection:'photos'}],
           storeAs:'photos' 
        }
    ]
}

const mapStateToProps = (state) => {
    return {
        //auth to query firestore 
        auth:state.firebase.auth,
        //profile to get currentuser profile photo
        profile:state.firebase.profile,
        //photos, to display all the photos we uploaded to firestore. using the storeAs 'photos' firestore reducer
        photos:state.firestore.ordered.photos,
        loading:state.async.loading
    }
}

const mapDispatchToProps ={
    uploadProfileImage,
    deletePhoto,
    setMainPhoto
}


class PhotosPage extends Component {

    state = {
        files: [],
        fileName:'',
        cropResult:null,
        image:{}
    }

    //method to finally upload image
    uploadImage = async () => {
        try{
            await this.props.uploadProfileImage(this.state.image, this.state.fileName);
            this.cancelCrop();
            toastr.success('Success!', 'Photo has been uploaded')
        }catch(error){
            toastr.error('Oops', error.message);
        }
    }

    //method to cancel cropping
    cancelCrop = () => {
        this.setState({
            files:[],
            images:{}
        })
    }


    //method to crop photo
    cropImage = () => {
        if(typeof this.refs.cropper.getCroppedCanvas() === 'undefined'){
            return;
        }

        this.refs.cropper.getCroppedCanvas().toBlob(blob => {
            let imageUrl = URL.createObjectURL(blob);
            this.setState({
                cropResult:imageUrl,
                image:blob
            })
        }, 'image/jpeg');
    }

    onDrop = (files) => {
        this.setState({
            files,
            fileName:files[0].name
        })
    }


    //method to handle the deleting of photos
    handlePhotoDelete = (photo) => async => {
        try{
            this.props.deletePhoto(photo);
        }catch(error){
            toastr.error('Oops!', error.message);
        }
    }

//method to set main profile photo
    handleSetMainPhoto = (photo) => async => {
        try {

            this.props.setMainPhoto(photo);
        }catch(error){
            toastr.error('Oops!', error.message);
        }
    }



    render() {

        const { photos, profile, loading} = this.props;

        //filter photo -> not to display already twice
        let filteredPhotos;
        if(photos){
            filteredPhotos = photos.filter(photo => {
                return photo.url !== profile.photoURL
            })
        }

        return (
            <Segment>
                <Header dividing size='large' content='Your Photos' />
                <Grid>
                    <Grid.Row />
                    <Grid.Column width={4}>
                        <Header color='teal' sub content='Step 1 - Add Photo'/>

                        {/* dragging or clicking to add photo using dropzone */}
                        <Dropzone onDrop={this.onDrop} multiple={false}> 
                            <div style={{paddingTop:'30px', textAlign:"center"}}>
                                <Icon name="upload" size="huge"/>
                                <Header content="Drag photo here or click to add photo"/>
                            </div>
                        </Dropzone>

                    </Grid.Column>
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 2 - Resize image' />

                        {/* cropping of the photo */}
                        {this.state.files[0] &&
                        <Cropper
                        style={{height:'200px',width:'100%'}}
                        ref='cropper'
                        src={this.state.files[0].preview}
                        aspectRatio={1}
                        viewMode={0}
                        dragMode="move"
                        guides={false}
                        scalable={true}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        crop={this.cropImage}
                        
                        />  }


                    </Grid.Column>
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 3 - Preview and Upload' />

                        {/* previewing the image */}
                        {this.state.files[0] && (
                            <div>
                                <Image 
                                style={{minHeight:'200px', minWidth:'200px'}} 
                                src={this.state.cropResult}  
                                />

                                <Button.Group>
                                    <Button loading={loading} onClick={this.uploadImage} style={{width: '100px'}} positive icon='check'/>
                                    <Button disabled={loading} onClick={this.cancelCrop} style={{width: '100px'}} icon='close'/>
                                </Button.Group>
                            </div>
                        )}
                    </Grid.Column>

                </Grid>

                <Divider/>
                <Header sub color='teal' content='All Photos'/>

                <Card.Group itemsPerRow={5}>
                    <Card>
                        <Image src={profile.photoURL || '/assets/user.png'}/>
                        <Button positive>Main Photo</Button>
                    </Card>
                        
                        {/* looping through the photos that is store on firebase currentuser data */}
                      {photos && filteredPhotos.map(photo => (

                      
                            <Card key={photo.id}>
                                <Image
                                    src={photo.url}
                                />
                                <div className='ui two buttons'>
                                    <Button onClick={this.handleSetMainPhoto(photo)} basic color='green'>Main</Button>
                                    <Button onClick={this.handlePhotoDelete(photo)} basic icon='trash' color='red' />
                                </div>
                            </Card>
                        ))}

                </Card.Group>
            </Segment>
        );
    }
}

export default compose(
    connect(mapStateToProps , mapDispatchToProps),
    firestoreConnect(auth => query(auth))
)(PhotosPage);