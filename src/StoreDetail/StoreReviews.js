import React from 'react';
import { ListGroupItem, ListGroup, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
//const util = require('util'); //print an object

export const createRating = function(rating, index) {
  return (
    <span className="pr-1 h5" key={index} role="img" aria-label="rating">⭐</span>
  )
}

const createItem = function(review, index) {
  return(
    <ListGroupItem key={index} className="d-flex justify-content-between border-bottom border-right-0 border-left-0">
      <div>
      <ListGroupItemHeading className="font-weight-bold">{review['title']}</ListGroupItemHeading>
      <ListGroupItemText className="pb-2 font-weight-bold text-secondary">{review['name']}, {review['timestamp'].toDateString()}</ListGroupItemText>
      <ListGroupItemText>{review['detail']}</ListGroupItemText>  
      </div>     
      <span className="float-right">{[...Array(review['rating'])].map(createRating)}</span>
    </ListGroupItem>
  );
};

export const StoreReviews = ({reviews}) => (
  <ListGroup className="card pl-4 pr-4">{typeof reviews !== 'undefined' ? reviews.map(createItem) : null}</ListGroup>
)