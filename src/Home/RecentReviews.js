import React, { Component } from 'react';
import { Card, CardBody, CardTitle, ListGroupItem, ListGroup, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class RecentReviews extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    var createItem = function(review, index) {
      return(
        <ListGroupItem key={index}>
          <ListGroupItemHeading>{review['title']}</ListGroupItemHeading>
          <ListGroupItemText>{review['detail']}</ListGroupItemText>          
        </ListGroupItem>
      );
    }.bind(this);

    return(
      <Card className="mt-5">
        <CardBody>
          <CardTitle className="text-uppercase">Recent Reviews</CardTitle>
            <ListGroup>{typeof this.props.reviews !== 'undefined' ? this.props.reviews.map(createItem) : null}</ListGroup>
        </CardBody>
      </Card>
    )
  }
}

export default RecentReviews;