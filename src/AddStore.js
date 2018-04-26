import React, { Component } from 'react';
import { UncontrolledAlert, Container, Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import * as firebase from "firebase";

export class AddStore extends Component {
    constructor (props) {
    super(props);

    this.state = { isLoading: false, storeName: "", storeURL: "", storeDescription: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddStore = this.handleAddStore.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleAddStore(storeID, storeName, storeDescription, storeURL) {
    var db = firebase.firestore();
    var self = this;

    //add new store
    var newStoreUpdate = {};

    newStoreUpdate['description']=storeDescription;
    newStoreUpdate['name']=storeName;
    newStoreUpdate['id']=storeID;
    newStoreUpdate['url']=storeURL;

    if (typeof this.state.store !== 'undefined') {
      var similarStoreUpdate = {};
      similarStoreUpdate[this.state.store.storeID]=true;
      newStoreUpdate['similarStores']=similarStoreUpdate;
    }

    db.collection('unapprovedStores').doc(storeID).set(newStoreUpdate)
      .then(function() {
        self.setState({addStoreSuccess: true, storeName: "", storeURL: "", storeDescription: "", storeNameValidated: null, storeDescriptionValidated: null, storeURLValidated: null});
    })
      .catch(function(error) {
        self.setState({addStoreSuccess: false, addStoreError: error});
    });
  }

  handleSubmit() {
    var validated = true;

    if (typeof this.state.storeURL === 'undefined' || this.state.storeName === "") {
      validated = false;
      this.setState({storeNameValidated: false});
    }

    if (typeof this.state.storeURL === 'undefined' || this.state.storeURL === "") {
      validated = false;
      this.setState({storeURLValidated: false});
    }

    if (typeof this.state.storeDescription === 'undefined' || this.state.storeDescription === "") {
      validated = false;
      this.setState({storeDescriptionValidated: false});
    }

    if (validated) {
      //add to database as a new unapproved store
      var storeID = this.state.storeName;
      storeID = storeID.replace(/\s+/g, '-').toLowerCase();
      this.handleAddStore(storeID, this.state.storeName, this.state.storeDescription, this.state.storeURL);
    } 
  }

  handleNameChange(event) {
    this.setState({storeName: event.target.value, storeNameValidated: event.target.value !== "" ? true : false});
  }

  handleDescriptionChange(event) {
    this.setState({storeDescription: event.target.value, storeDescriptionValidated: event.target.value !== "" ? true : false});
  }

  handleURLChange(event) {
    this.setState({storeURL: event.target.value, storeURLValidated: event.target.value !== "" ? true : false});
  }

  render() {
  var successMessage = <UncontrolledAlert color="success">Thanks for submitting the store!</UncontrolledAlert>;
  var errorMessage = <UncontrolledAlert color="danger">Sorry! There was an error with your submission!</UncontrolledAlert>;
  var showMessage = this.state.addStoreSuccess === true ? successMessage : this.state.addStoreSuccess===false ? errorMessage : '';

  return (
  <Container className="container-index">
  	<Card className="mt-5">
      {showMessage} 
  		<CardHeader className="border-0 mt-3">
        <CardTitle className="d-inline font-weight-bold">Add New Store</CardTitle>
  		</CardHeader>
  		<CardBody>
          <Form>
            <FormGroup>
              <Label for="storeName" size="lg">Store Name</Label>
              <Input className={this.state.storeNameValidated === true ? "is-valid" : this.state.storeNameValidated === false ? "is-invalid" : ""} type="name" name="storeName" id="storeName" placeholder="store name" size="lg" onChange={this.handleNameChange} value={this.state.storeName} />
            </FormGroup>
            <FormGroup>
              <Label for="storeURL" size="lg">Store URL</Label>
              <Input className={this.state.storeURLValidated === true ? "is-valid" : this.state.storeURLValidated === false ? "is-invalid" : ""} type="url" name="url" id="storeURL" placeholder="store url" size="lg" onChange={this.handleURLChange} value={this.state.storeURL} />
            </FormGroup>
            <FormGroup>
              <Label for="storeDescription" size="lg">Store Description</Label>
              <Input className={this.state.storeDescriptionValidated === true ? "is-valid" : this.state.storeDescriptionValidated === false ? "is-invalid" : ""} type="textarea" name="storeDescription" id="storeDescription" placeholder="store description" size="lg" value={this.state.storeDescription} onChange={this.handleDescriptionChange}/>
            </FormGroup>
      	 </Form>
        <Button color="primary" className="mt-3" onClick={this.handleSubmit}>Submit</Button>
    	</CardBody>
  	</Card>
  </Container>
  )}
}