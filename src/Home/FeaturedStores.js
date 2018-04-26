import React from 'react';
import {ListGroupItem, ListGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
var ReactGA = require('react-ga');

const createItem = function(store, index) {
  return(
    <ListGroupItem key={store.storeID} className="border-0">
        <span className="mr-3">{index + 1}</span>
        <span className="mr-auto"><Link to={'/similar-stores/'+store.storeID}>{store.name.toProperCase()}</Link></span>
        <span className="float-right ml-auto">
          <ReactGA.OutboundLink eventLabel={store.url} to={store.url} target="_blank">
            visit
          </ReactGA.OutboundLink>
        </span>
    </ListGroupItem>
  );
};

export const FeaturedStores = ({stores}) => (
  <ListGroup>{typeof stores !== 'undefined' ? stores.map(createItem) : null}</ListGroup>
)