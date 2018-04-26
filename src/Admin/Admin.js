import React, { Component } from 'react';
import * as firebase from "firebase";

import { Container, Row, Col, Button, FormGroup, Form, UncontrolledAlert, Input, Label } from 'reactstrap';
import {Dashboard} from '../Admin/Dashboard.js'; 
import Helmet from 'react-helmet';

const LoginScreen = ({handleSubmit, showLoading, handleEmailChange, handlePasswordChange, error}) => (
	<Row className="mt-5">
		<Col xs={12} lg={4} className="m-auto bg-white pt-5 pb-5 rounded">
			{typeof error !== 'undefined' ? <UncontrolledAlert color="danger">Error logging in</UncontrolledAlert> : ''}
      <Form className="p-3">
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="email" onChange={handleEmailChange} />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="password" onChange={handlePasswordChange} />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit {showLoading}</Button>
      </Form>
		</Col>
	</Row>
);


export class Admin extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    this.state = {
      isLoading: false,
      loginSuccess: false
    }

    var self = this;

    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		  	console.log("logged in");
    		self.setState({loginSuccess: true, isLoading: false });
		  } else {
		  	console.log("not logged in")
    		self.setState({loginSuccess: false, isLoading: false});
		  }
		});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value, emailValidated: event.target.value !== "" ? true : false });
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value, passwordValidated: event.target.value !== "" ? true : false });
  }

  handleSubmit() {
    var self = this;
    this.setState({ isLoading: true });

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;
    	self.setState({ isLoading: false, loginError: errorMessage });  		
    	console.log("error signing in "+errorMessage+" error code "+errorCode);
		});
  }

	render() {
		var loadingSpinner = <i className="fa fa-circle-o-notch fa-spin"></i>;
		var showLogin = <LoginScreen handleSubmit={this.handleSubmit} showLoading={ this.state.isLoading === true ? loadingSpinner : ''} handleEmailChange={this.handleEmailChange} handlePasswordChange={this.handlePasswordChange} error={this.state.loginError} />;
		var showDash = <Dashboard />

		return(
			<Container className="container-index bg-light" fluid>
				{this.state.loginSuccess === true ? showDash : showLogin }
			</Container>
		)
  }
}