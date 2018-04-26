import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardFooter, CardText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
var ReactGA = require('react-ga');

export const StoreCard = ({store, showStoreLink}) => (
  <Card>
    <CardBody>
      <CardTitle className="text-uppercase text-center">
        {typeof store.logo !== 'undefined' ? <img src={store.logo} alt={store.name} className="store-card-logo" /> : store.name}
      </CardTitle>
      <CardText className="text-center">{store.description}</CardText>
    </CardBody>
    <CardFooter>
      <Row>
        <Col xs={12} className="text-center">
          <ReactGA.OutboundLink eventLabel={store.url} to={store.url} target="_blank">
            <Button>Visit Website</Button>
          </ReactGA.OutboundLink>
        </Col>
        <Col xs={12} className={showStoreLink ? "text-center" : "text-center d-none"} >
          <Link to={'/similar-stores/'+store.storeID}>see similar stores</Link>
        </Col>
      </Row>
    </CardFooter>
  </Card>
)