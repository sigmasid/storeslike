import React, { Component } from 'react';
import { UncontrolledAlert, Container, Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import * as firebase from "firebase";

export class Contact extends Component {
    constructor (props) {
    super(props);

    this.state = { isLoading: false, contactName: "", contactEmail: "", contactMessage: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  handleAddContact(contactName, contactEmail, contactMessage) {
    var db = firebase.firestore();
    var self = this;

    var contact = {};

    contact['name']=contactName;
    contact['email']=contactEmail;
    contact['message']=contactMessage;

    db.collection('messages').add(contact)
      .then(function() {
        self.setState({contactSuccess: true, contactName: "", contactEmail: "", contactMessage: "", nameValidated: null, emailValidated: null, messageValidated: null});
    })
      .catch(function(error) {
        self.setState({contactSuccess: false, contactError: error});
    });
  }

  handleSubmit() {
    var validated = true;

    if (typeof this.state.contactName === 'undefined' || this.state.contactName === "") {
      validated = false;
      this.setState({nameValidated: false});
    }

    if (typeof this.state.contactEmail === 'undefined' || this.state.contactEmail === "") {
      validated = false;
      this.setState({emailValidated: false});
    }

    if (typeof this.state.contactMessage === 'undefined' || this.state.contactMessage === "") {
      validated = false;
      this.setState({messageValidated: false});
    }

    if (validated) {
      this.handleAddContact(this.state.contactName, this.state.contactEmail, this.state.contactMessage);
    } 
  }

  handleNameChange(event) {
    this.setState({contactName: event.target.value, nameValidated: event.target.value !== "" ? true : false});
  }

  handleEmailChange(event) {
    this.setState({contactEmail: event.target.value, emailValidated: event.target.value !== "" ? true : false});
  }

  handleMessageChange(event) {
    this.setState({contactMessage: event.target.value, messageValidated: event.target.value !== "" ? true : false});
  }

  render() {
  var successMessage = <UncontrolledAlert color="success">Thanks for contacting us! We will be in touch soon.</UncontrolledAlert>;
  var errorMessage = <UncontrolledAlert color="danger">Sorry! There was an error with your submission!</UncontrolledAlert>;
  var showMessage = this.state.contactSuccess === true ? successMessage : this.state.contactSuccess===false ? errorMessage : '';

  return (
  <Container className="container-index">
  	<Card className="mt-5">
      {showMessage} 
  		<CardHeader className="border-0">
        <CardTitle className="d-inline">Contact Us</CardTitle>
  		</CardHeader>
  		<CardBody>
          <Form>
            <FormGroup>
              <Label for="contactName" size="lg">Your Name</Label>
              <Input className={this.state.nameValidated === true ? "is-valid" : this.state.nameValidated === false ? "is-invalid" : ""} type="name" name="contactName" id="contactName" size="lg" onChange={this.handleNameChange} value={this.state.contactName} />
            </FormGroup>
            <FormGroup>
              <Label for="contactEmail" size="lg">Your Email</Label>
              <Input className={this.state.emailValidated === true ? "is-valid" : this.state.emailValidated === false ? "is-invalid" : ""} type="url" name="contactEmail" id="contactEmail" size="lg" onChange={this.handleEmailChange} value={this.state.contactEmail} />
            </FormGroup>
            <FormGroup>
              <Label for="contactMessage" size="lg">Your Message</Label>
              <Input className={this.state.messageValidated === true ? "is-valid" : this.state.messageValidated === false ? "is-invalid" : ""} type="textarea" name="contactMessage" id="contactMessage" size="lg" value={this.state.contactMessage} onChange={this.handleMessageChange}/>
            </FormGroup>
      	 </Form>
        <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
    	</CardBody>
  	</Card>
  </Container>
  )}
}