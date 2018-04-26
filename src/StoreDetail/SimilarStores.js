import React from 'react';
import { Row, Col, ListGroupItem, ListGroup, ListGroupItemHeading, ListGroupItemText, Button } from 'reactstrap';
import { Link } from 'react-router-dom'
var ReactGA = require('react-ga');

var createItem = function(store, index) {
  return(
    <ListGroupItem key={index} className="border-bottom border-right-0 border-left-0">
      <Row className="row-no-padding">
        <Col xs={1}>
          <ListGroupItemHeading>{index + 1}. </ListGroupItemHeading>
        </Col>
        <Col xs={9}>
          <ListGroupItemHeading>{store.name.toProperCase()}</ListGroupItemHeading>
          <ListGroupItemText>{store.description}</ListGroupItemText>
        </Col>
        <Col xs={2} className="text-center">
          <ReactGA.OutboundLink eventLabel={store.url} to={store.url} target="_blank">
            <Button>visit</Button>          
          </ReactGA.OutboundLink>
          <ListGroupItemText><Link to={"/similar-stores/"+store.id}>similar stores</Link></ListGroupItemText>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export const SimilarStores = ({stores}) => (
  <ListGroup className="card pl-4 pr-4">{stores.map(createItem)}</ListGroup>
)