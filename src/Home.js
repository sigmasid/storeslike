import React, { Component } from 'react'
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import Search from './Home/SearchStores.js'; 
import {FeaturedStores} from './Home/FeaturedStores.js'; 
import {StoreCard} from './Home/StoreCard.js'; 
import {StoreReviews} from './StoreDetail/StoreReviews.js';
import * as firebase from "firebase";
import * as firestore from "firebase/firestore";

class Home extends Component {
    constructor (props) {
    super(props);

    var db = firebase.firestore();
    var reviewsRef = db.collection('reviews').orderBy('timestamp').limit(3);
    var featuredStoresRef = db.collection('stores').where('isFeatured', '==', true);

    this.state = {
      isLoading: true
    }

    featuredStoresRef.get()
    .then(snapshot => {
        var featuredStoreList = [];
        snapshot.forEach(doc => {
          var currentStore = doc.data();
          currentStore.storeID = doc.id;
          featuredStoreList.push(currentStore);
        });
        this.setState({ featuredStores: featuredStoreList });        
    })
    .catch(err => {
        console.log('Error getting documents', err);
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
        console.log('Error getting documents', err);
    });   
  }
  render() {
    var storeCard = typeof this.state.featuredStores !== 'undefined' ? <StoreCard store={this.state.featuredStores[0]} showStoreLink={true} /> : null;

  	return(
  		<div className="container-index">
  			<Row className="mt-5 mb-5">
  				<Col xs={12} lg={6} className="m-auto">
      			<Search />
  				</Col>
  			</Row>  				
  			<Row>
  				<Col xs={12} lg={3}>
            <Card>
              <CardBody>
                <CardTitle className="text-uppercase h5 font-weight-bold">Featured Stores</CardTitle>
                <FeaturedStores stores={this.state.featuredStores} />
              </CardBody>
            </Card>
  				</Col>
  				<Col xs={12} lg={6}>
      			{ storeCard }
            <Card className="mt-5">
              <CardBody>
                <CardTitle className="text-uppercase h5 font-weight-bold">Recent Reviews</CardTitle>
                <StoreReviews reviews={this.state.reviews} showStoreName={true} />
              </CardBody>
            </Card>
      		</Col>
  				<Col xs={12} lg={3}>
      			<FeaturedStores listTitle={"Recently Added"} />
  				</Col>
      	</Row>
  		</div>
  	)
  }
}

export default Home;