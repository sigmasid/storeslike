import React, { Component } from 'react';
import * as firebase from "firebase";

import { Container, Row, Col, Button, Fade, Alert, Card, CardTitle, CardBody } from 'reactstrap';
import {StoreCard} from './Home/StoreCard.js';
import {SimilarStores} from './StoreDetail/SimilarStores.js';
import {StoreReviews} from './StoreDetail/StoreReviews.js';
import {AddStore} from './AddSimilarStore.js'; 
import {AddReview} from './AddReview.js'; 
import Helmet from 'react-helmet';

//const util = require('util'); //print an object

const createRating = function(rating, index) {
  return (
    <span className="pr-1 h5" key={index} role="img" aria-label="rating">⭐</span>
  )
}

export class StoreDetail extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: true,
      addStoreMode: false,
      addReviewMode: false,
      visibleAddReview: false,
      addStoreSuccess: false
    }

    var storeID = props.match.params.id;

    this.toggleAddStore = this.toggleAddStore.bind(this);
    this.toggleAddReview = this.toggleAddReview.bind(this);
    this.handleAddStore = this.handleAddStore.bind(this);
    this.handleAddReview = this.handleAddReview.bind(this);
    this.onDismissAddStore = this.onDismissAddStore.bind(this); 
    this.onDismissAddReview = this.onDismissAddReview.bind(this);     
    this.getStore = this.getStore.bind(this);     

    this.getStore(storeID);
  }

  getStore(storeID) {
    var db = firebase.firestore();
    var storeRef = db.collection('stores').doc(storeID);
    var reviewsRef = db.collection('reviews').where('storeID', '==', storeID);
    //var similarStoresRef = db.collection('stores').where('category.'+selectedStore.category[0], '==', true).where('type.'+selectedStore.type[0], '==', true).where('type.'+selectedStore.style[0], '==', true);

    storeRef.get()
      .then(doc => {
        if (!doc.exists) {
          this.setState({ isLoading: false });
        } else {
          var selectedStore = doc.data();
          var queryText = "db.collection('stores')";
          selectedStore.storeID = storeID;

          Object.keys(selectedStore.category).map(function(key, index) {
            queryText = queryText + ".where('category."+key+"', '==', true)";
            return queryText;
          });

          if (selectedStore.type !== undefined) {
            queryText = queryText + ".where('type."+Object.keys(selectedStore.type)[0]+"', '==', true)";
          }

          if (selectedStore.style !== undefined) {
            queryText = queryText + ".where('style."+Object.keys(selectedStore.style)[0]+"', '==', true)";
          }

          if (selectedStore.storeType !== undefined) {
            queryText = queryText + ".where('storeType."+Object.keys(selectedStore.storeType)[0]+"', '==', true)";
          }

          queryText = queryText + ".limit(20)";
          var query = eval(queryText);
          
          query.get()
            .then(snapshot => {
              var similarStoreList = [];
              snapshot.forEach(doc => {
                var currentStore = doc.data();
                currentStore.storeID = doc.id;

                if (selectedStore.storeID !== currentStore.storeID) {
                  similarStoreList.push(currentStore);
                }
              });
              this.setState({ similarStores: similarStoreList });
          })
          .catch(err => {
              //console.log('Error getting documents', err);
          });
          this.setState({ store: selectedStore, isLoading: false });
        }
      })
      .catch(err => {
        //console.log('Error getting store', err);
    });

    reviewsRef.get()
    .then(snapshot => {
        var reviews = [];
        snapshot.forEach(doc => {
          reviews.push(doc.data());
        });
        this.setState({ reviews: reviews });        
    })
    .catch(err => {
        //console.log('Error getting reviews', err);
    });


  }

  componentWillReceiveProps(nextProps) {
    var storeID = nextProps.match.params.id;

    if (storeID !== this.state.store.storeID) {
      this.getStore(storeID);
    }
  }


  onDismissAddStore() {
    this.setState({ addStoreSuccess: false });
  }

  onDismissAddReview() {
    this.setState({ visibleAddReview: false });
  }

  handleAddStore(storeID, storeName, storeDescription, storeURL) {
    var db = firebase.firestore();
    var self = this;

    if (typeof storeDescription === 'undefined') {
      var storeUpdate = {};
      storeUpdate[`similarStores.${this.state.store.storeID}`] = true;
      //not a new store so add to existing store's update
      db.collection('stores').doc(storeID).update(storeUpdate)
        .then(function() {
          self.setState({addStoreMode: !self.state.addStoreMode, addStoreSuccess: true});
      })        
        .catch(function(error) {
          self.setState({addStoreMode: !self.state.addStoreMode, addStoreSuccess: false, addStoreError: error});
      });;
    } else {
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
          self.setState({addStoreMode: !self.state.addStoreMode, addStoreSuccess: true});
      })
        .catch(function(error) {
          self.setState({addStoreMode: !self.state.addStoreMode, addStoreSuccess: false, addStoreError: error});
      });;
    }
  }

  handleAddReview(reviewRating, reviewTitle, reviewText, reviewerName) {
    var review = {
      storeID: this.state.store.storeID,
      storeName: this.state.store.name,
      name: reviewerName,
      title: reviewTitle,
      detail: reviewText,
      rating: reviewRating,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    var self = this;

    var db = firebase.firestore();
    db.collection('unapprovedReviews').add(review).then(function() {
      self.setState({addReviewMode: !this.state.addReviewMode, visibleAddReview: true});
    }).catch(function(error) {
      self.setState({addReviewMode: !self.state.addReviewMode, addReviewSuccess: false, addReviewError: error});
    });;
  }

  toggleAddStore() {
    this.setState({addStoreMode: !this.state.addStoreMode});
  }

  toggleAddReview() {
    this.setState({addReviewMode: !this.state.addReviewMode});
  }

  render() {
    var storeCard = typeof this.state.store !== 'undefined' ? <StoreCard store={this.state.store} /> : '';

    var addStore = typeof this.state.store !== 'undefined' ? <AddStore storeName={this.state.store.name} handleClose={this.toggleAddStore} handleSubmit={this.handleAddStore} /> : '';
    var addReview = typeof this.state.store !== 'undefined' ? <AddReview storeName={this.state.store.name} handleClose={this.toggleAddReview} handleSubmit={this.handleAddReview} /> : '';

    var similarStores = typeof this.state.similarStores !== 'undefined' ? <SimilarStores stores={this.state.similarStores} /> : '';
    var reviews = typeof this.state.reviews !== 'undefined' ? <StoreReviews reviews={this.state.reviews} /> : '';

    var addMeta = (typeof this.state.store !== 'undefined') ? 
    <Helmet title={ this.state.store.name.toProperCase() + " | Stores & Brands Like " + this.state.store.name } 
            meta={[
                {"name": "description", "content": typeof this.state.store !== 'undefined' ? this.state.store.description : ''},
                {property: "og:type", content: "website"}
                ]}
    /> : <Helmet title={ "Discover Stores & Brands Like " + this.props.match.params.id } 
            meta={[
                {"name": "description", "content": "Stores & Brands Like "+ this.props.match.params.id+" and Reviews!"},
                {property: "og:type", content: "website"}
                ]}
    />;

    return (
    <Container className="container-index">
    {addMeta}
    <Row className="mt-5">
      <Col xs={12}>
        { storeCard }
      </Col>
    </Row>
    <Row className="mt-5">
      <Col xs={12}>
        <Card className="p-3 h-100">
          <CardTitle className="text-uppercase h6 font-weight-bold">Similar Stores</CardTitle>
          <CardBody className="d-flex align-items-end mt-auto p-0">
            <Button color="link" className="text-left p-0" onClick={this.toggleAddStore}>
              <span className="text-info"><i className="fas fa-plus-circle pr-2"></i>add store</span>
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12}>
        <Alert color="info" isOpen={this.state.addStoreSuccess} toggle={this.onDismissAddStore}>
          Thanks for your suggestion!
        </Alert>
        <Fade in={this.state.addStoreMode}>
          <span className={this.state.addStoreMode ? "d-block" : "d-none"}>
            { addStore }
          </span>
        </Fade>
        <Fade in={!this.state.addStoreMode}>
          <span className={this.state.addStoreMode ? "d-none" : "d-block"}>
            { similarStores }
          </span>
        </Fade>
      </Col>
    </Row>
    <Row className="mt-5">
      <Col xs={12}>
        <Card className="p-3 h-100">
          <CardTitle className="text-uppercase h6 font-weight-bold">Reviews</CardTitle>
          <CardBody className="d-flex align-items-end mt-auto p-0">
            <Button color="link" className="text-left p-0" onClick={this.toggleAddReview}>
              <span className="text-info"><i className="fas fa-plus-circle pr-2"></i>add Review</span>
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12}>
        <Alert color="info" isOpen={this.state.visibleAddReview} toggle={this.onDismissAddReview}>
          Thanks for your review!
        </Alert>
        <Fade in={this.state.addReviewMode}>
          <span className={this.state.addReviewMode ? "d-block" : "d-none"}>
            { addReview }
          </span>
        </Fade>
        <Fade in={!this.state.addReviewMode}>
          <span className={this.state.addReviewMode ? "d-none" : "d-block"}>
            { reviews }
          </span>
        </Fade>
      </Col>
    </Row>
  </Container>
  )}
}