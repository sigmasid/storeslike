import React, { Component } from 'react';
import { Card, CardTitle, Fade } from 'reactstrap';
import {InstantSearch, SearchBox, Hits, PoweredBy} from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
//const util = require('util'); //print an object

function Hit({hit}) {
  return (
    <div className="hit">
    <div className="hit-content">
      <div className="hit-name"><Link to={'/similar-stores/'+hit.id}>{hit.name}</Link></div>
    </div>
  </div>
  );
}

class StoreSearch extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isSearching: false
    };

    this.searchStateChanged = this.searchStateChanged.bind(this);
    this.hideResults = this.hideResults.bind(this);
  }

  searchStateChanged(searchState) {
    this.setState({isSearching: searchState.query !== '' }); 
  }

  hideResults() {
    this.setState({isSearching: false })
  }

  render() {
    return(
      <Card className="border-0 p-4">
        <CardTitle className="text-uppercase h5 font-weight-bold">Search Stores</CardTitle>
          <InstantSearch apiKey="a04e4fe373148200008b5e580198f645" appId="T5C8R2GQUI" indexName="stores" onSearchStateChange={this.searchStateChanged}>
            <SearchBox translations={{placeholder: 'Search for stores'}} onReset={this.hideResults} />
            <PoweredBy />
            <Fade in={this.state.isSearching}>
              <div className={this.state.isSearching ? "d-block w-100" : "d-none w-100"}><Hits hitComponent={Hit}/></div>
            </Fade>
          </InstantSearch>
      </Card>
    )
  }
}

export default StoreSearch;