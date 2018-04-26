import React, { Component } from 'react';
import { Container, Row, Col, Card, CardTitle, CardFooter, Button, ListGroupItem, ListGroup, ListGroupItemHeading, Nav, NavItem, NavLink, TabContent, TabPane, ListGroupItemText} from 'reactstrap';
import * as firebase from "firebase";
import classnames from 'classnames';
import {createRating} from '../StoreDetail/StoreReviews.js';

const StoreList = ({stores, approve, reject}) => (
  <ListGroup>{typeof stores !== 'undefined' ? stores.map((store, index) => <StoreListItem key={index} index={index} store={store} approve={approve} reject={reject} />) : null}</ListGroup>
)

const ReviewList = ({reviews, approve, reject}) => (
  <ListGroup>{typeof reviews !== 'undefined' ? reviews.map((review, index) => <ReviewListItem key={index} index={index} review={review} approve={approve} reject={reject} />) : null}</ListGroup>
)

class ReviewListItem extends Component {
  constructor (props) {
    super(props);
    this.approveReview = this.approveReview.bind(this);
    this.rejectReview = this.rejectReview.bind(this);
  }

  approveReview() {
  	this.props.approve(this.props.review);
  }

  rejectReview() {
  	this.props.reject(this.props.review);
  }

	render() {
  return(
    <ListGroupItem key={this.props.index}>
		  <Row className="mt-3">
		  	<Col xs={10} className="d-flex justify-content-between">
		  		<div>
	      		<ListGroupItemHeading className="font-weight-bold">{this.props.review.storeName.toProperCase()}</ListGroupItemHeading>
	      		<ListGroupItemHeading>{this.props.review.title}</ListGroupItemHeading>
	      		<ListGroupItemText className="pb-2 font-weight-bold text-secondary">{this.props.review.name}, {this.props.review.timestamp.toDateString()}</ListGroupItemText>
	      		<ListGroupItemText>{this.props.review.detail}</ListGroupItemText>
      		</div>
		      <span className="float-right">{[...Array(this.props.review.rating)].map(createRating)}</span>
      	</Col>
      	<Col xs={2}>
    			<Button color="primary" className="mb-3" onClick={this.approveReview}><i className="fas fa-check pr-2"></i>Approve</Button>
					<Button color="secondary" onClick={this.rejectReview}><i className="fas fa-times pr-2"></i>Reject</Button>
      	</Col>
      </Row>
    </ListGroupItem>
  );
	}
}

class StoreListItem extends Component {
  constructor (props) {
    super(props);
    this.approveStore = this.approveStore.bind(this);
    this.rejectStore = this.rejectStore.bind(this);
  }

  approveStore() {
  	this.props.approve(this.props.store);
  }

  rejectStore() {
  	this.props.reject(this.props.store);
  }

	render() {
  return(
    <ListGroupItem>
		  <Row className="mt-3">
		  	<Col xs={10}>
	      	<ListGroupItemHeading className="font-weight-bold text-dark">{this.props.store.name.toProperCase()}</ListGroupItemHeading>
		     	<ListGroupItemText className="text-secondary">{this.props.store.description}</ListGroupItemText>
		     	<Button color="link" className="float-left p-0 mt-2">edit</Button>
		    </Col>
		    <Col xs={2}>
  	    	<Button color="primary" className="mb-3" onClick={this.approveStore}><i className="fas fa-check pr-2"></i>Approve</Button>
					<Button color="secondary" onClick={this.rejectStore}><i className="fas fa-times pr-2"></i>Reject</Button>
		    </Col>
		  </Row>
    </ListGroupItem>
  );
	}
}

export class Dashboard extends Component {
  constructor (props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.approveReview = this.approveReview.bind(this);
    this.rejectReview = this.rejectReview.bind(this);
    this.getUnapprovedStores = this.getUnapprovedStores.bind(this);
    this.getUnapprovedReviews = this.getUnapprovedReviews.bind(this);

    this.getUnapprovedStores();

    this.state = {
      isLoading: true,
      activeTab: '1'
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
    	if (this.state.activeTab === '2') {
		    this.getUnapprovedReviews();
    	}

      this.setState({
        activeTab: tab
      });
    }
  }

  approveReview(review) {
  	var updateText = {};
  	updateText['approved'] = true;

    var self = this;

  	var db = firebase.firestore();
    db.collection('unapprovedReviews').doc(review.id).update(updateText)
	    .then(function() {
	    	//remove the store from the list
	    	var index = self.state.unapprovedReviews.indexOf(review);

	    	if (index > -1) {
		    	var newUnapprovedReviews = self.state.unapprovedReviews;
    			newUnapprovedReviews.splice(index, 1);
    			self.setState({unapprovedReviews: newUnapprovedReviews});
				}	    	
	    })        
	    .catch(function(error) {
	    	console.log('update error '+error);
    });
  }

  approve(store) {

  	var updateText = {};
  	updateText['approved'] = true;

    var self = this;

  	var db = firebase.firestore();
    db.collection('unapprovedStores').doc(store.id).update(updateText)
	    .then(function() {
	    	//remove the store from the list
	    	var index = self.state.unapprovedStores.indexOf(store);

	    	if (index > -1) {
		    	var newUnapprovedStores = self.state.unapprovedStores;
    			newUnapprovedStores.splice(index, 1);
    			self.setState({unapprovedStores: newUnapprovedStores});
				}	    	
	    })        
	    .catch(function(error) {
	    	console.log('update error '+error);
    });
  }

  reject(store) {
  	var db = firebase.firestore();
    var self = this;

  	var updateText = {};
  	updateText['approved'] = false;

    db.collection('unapprovedStores').doc(store.id).update(updateText)
	    .then(function() {
	    	var index = self.state.unapprovedStores.indexOf(store);

	    	if (index > -1) {
		    	var newUnapprovedStores = self.state.unapprovedStores;
    			newUnapprovedStores.splice(index, 1);
    			self.setState({unapprovedStores: newUnapprovedStores});
				}	  
	    })        
	    .catch(function(error) {
	    	console.log('update error '+error);
    });
  }

  rejectReview(review) {
  	var db = firebase.firestore();
    var self = this;

  	var updateText = {};
  	updateText['approved'] = false;

    db.collection('unapprovedReviews').doc(review.id).update(updateText)
	    .then(function() {
	    	var index = self.state.unapprovedReviews.indexOf(review);

	    	if (index > -1) {
		    	var newUnapprovedReviews = self.state.unapprovedReviews;
    			newUnapprovedReviews.splice(index, 1);
    			self.setState({unapprovedReviews: newUnapprovedReviews});
				}	  
	    })        
	    .catch(function(error) {
	    	console.log('update error '+error);
    });
  }

  getUnapprovedStores() {
	  var db = firebase.firestore();
	  var unapprovedStoresRef = db.collection('unapprovedStores');

	  unapprovedStoresRef.get()
	  .then(snapshot => {
	      var stores = [];
	      snapshot.forEach(doc => {
	        stores.push(doc.data());
	      });
	      this.setState({ unapprovedStores: stores });        
	    })
	    .catch(err => {
	        console.log('Error getting reviews', err);
	    });
  }

  getUnapprovedReviews() {
  	if (typeof this.state.unapprovedReviews === 'undefined') {

    var db = firebase.firestore();
    var unapprovedReviewsRef = db.collection('unapprovedReviews');

    unapprovedReviewsRef.get()
    .then(snapshot => {
        var newReviews = [];
        snapshot.forEach(doc => {
        	var newReview = doc.data();
        	newReview['id'] = doc.id; 
        	console.log("review key is "+doc.id);

          newReviews.push(newReview);
        });
        this.setState({ unapprovedReviews: newReviews });        
	    })
	    .catch(err => {
	        console.log('Error getting reviews', err);
	    });
	  }
  }

  logout() {
  	firebase.auth().signOut().then(function() {
  		console.log('signed out success');
		}).catch(function(error) {
			console.log(error);
		});
  }

	render() {
		return(
			<Container className="container-index">
				<Row className="mt-5">
					<Col xs={12}>
						<Card>
							<CardTitle>Welcome! Admin</CardTitle>
							<CardFooter>
								<Button onClick={this.logout}>Logout</Button>
							</CardFooter>
						</Card>
					</Col>
				</Row>
				<Row className="mt-5">
					<Col xs={12}>
		        <Nav tabs>
		          <NavItem className="p-0 h5 font-weight-bold">
		            <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
		              <i class="fas fa-shopping-bag pr-2"></i><span className="text-dark">Unapproved Stores</span>
		            </NavLink>
		          </NavItem>
		          <NavItem className="p-0 h5 font-weight-bold">
		            <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
		              <i class="fas fa-book pr-2"></i><span className="text-dark">Unapproved Reviews</span>
		            </NavLink>
		          </NavItem>
		        </Nav>
		        <TabContent activeTab={this.state.activeTab}>
		          <TabPane tabId="1">
                <StoreList stores={this.state.unapprovedStores} approve={this.approve} reject={this.reject} />
		          </TabPane>
		          <TabPane tabId="2">
                <ReviewList reviews={this.state.unapprovedReviews} approve={this.approveReview} reject={this.rejectReview} />
		          </TabPane>
		        </TabContent>
					</Col>
				</Row>
			</Container>
		)
  }
}