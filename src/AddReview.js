import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, Input, Col, ButtonToolbar, ButtonGroup} from 'reactstrap';

export class AddReview extends Component {
    constructor (props) {
    super(props);

    this.state = { reviewTitle: "", reviewerName: "", reviewText: "", reviewRating: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleSubmit() {
    var validated = true;

    if (this.state.reviewTitle === "") {
      validated = false;
      this.setState({titleValidated: false});
    }

    if (this.state.reviewTitle === "") {
      validated = false;
      this.setState({titleValidated: false});
    }

    if (this.state.reviewText === "") {
      validated = false;
      this.setState({detailValidated: false});
    }

    if (this.state.reviewerName === "") {
      validated = false;
      this.setState({nameValidated: false});
    }    

    if (validated) {
      this.props.handleSubmit(this.state.reviewRating, this.state.reviewTitle, this.state.reviewText, this.state.reviewerName);
    }
  }

  handleRatingChange(value) {
    console.log("setting rating to "+value);
    this.setState({reviewRating: value});    
  }

  handleTitleChange(event) {
    this.setState({reviewTitle: event.target.value, titleValidated: event.target.value !== "" ? true : false });
  }

  handleDetailsChange(event) {
    this.setState({reviewText: event.target.value, detailValidated: event.target.value !== "" ? true : false });
  }

  handleNameChange(event) {
    this.setState({reviewerName: event.target.value, nameValidated: event.target.value !== "" ? true : false });
  }

  render() {
  return (
  	<Card>
    <CardHeader className="border-0">
      <CardTitle className="d-inline">Add New Review for {this.props.storeName}</CardTitle>
      <Button className="close d-inline" onClick={this.props.handleClose}><span aria-hidden="true">&times;</span></Button>
    </CardHeader>
		<CardBody>
    <Form>
      <FormGroup row>
        <Label for="reviewRating" sm={2} size="lg">Rating</Label>
        <Col sm={10}>
          <ButtonToolbar>
            <ButtonGroup >
              <Button color="light" active={this.state.reviewRating === 1 ? true : false} onClick={() => this.handleRatingChange(1)} >1</Button>
              <Button color="light" active={this.state.reviewRating === 2 ? true : false} onClick={() => this.handleRatingChange(2)} >2</Button>
              <Button color="light" active={this.state.reviewRating === 3 ? true : false} onClick={() => this.handleRatingChange(3)} >3</Button>
              <Button color="light" active={this.state.reviewRating === 4 ? true : false} onClick={() => this.handleRatingChange(4)} >4</Button>
              <Button color="light" active={this.state.reviewRating === 5 ? true : false} onClick={() => this.handleRatingChange(5)} >5</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="storeName" sm={2} size="lg">Review Title</Label>
        <Col sm={10}>
          <Input className={this.state.titleValidated === true ? "is-valid" : this.state.titleValidated === false ? "is-invalid" : ""} type="name" name="name" id="reviewTitle" placeholder="title for your review" size="lg" onChange={this.handleTitleChange}  />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="storeName" sm={2} size="lg">Review Details</Label>
        <Col sm={10}>
          <Input className={this.state.detailValidated === true ? "is-valid" : this.state.detailValidated === false ? "is-invalid" : ""} type="textarea" name="name" id="reviewText" placeholder="what do you want to say about this store" size="lg" onChange={this.handleDetailsChange} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="storeURL" sm={2} size="lg">Your Name</Label>
        <Col sm={10}>
          <Input className={this.state.nameValidated === true ? "is-valid" : this.state.nameValidated === false ? "is-invalid" : ""} type="url" name="url" id="reviewName" placeholder="your name" size="lg" onChange={this.handleNameChange} />
        </Col>
      </FormGroup>
      <Button onClick={this.handleSubmit} color="primary">
      	Submit
      </Button>
  	</Form>
  	</CardBody>
	</Card>
  )}
}