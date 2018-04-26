import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, Input, Fade, ListGroup, ListGroupItem} from 'reactstrap';
import {InstantSearch } from 'react-instantsearch/dom';
import { connectStateResults } from 'react-instantsearch/connectors';
import { connectHits, connectSearchBox } from 'react-instantsearch/connectors';

//const util = require('util'); //print an object

const CustomHits = connectHits(({ hits, selectStore }) => {
  return(
  <ListGroup>
    {hits.map(hit =>
      <ListGroupItem key={hit.objectID} className="border-0" tag="a" href="#" action onClick={() => selectStore(hit)}>
        {hit.storeName}
      </ListGroupItem>
    )}
  </ListGroup>
  )}
);

const Content = connectStateResults(({ searchState, searchResults, props }) => {
    if (typeof searchState.query !== 'undefined' && searchResults && searchResults.nbHits === 0) {
      props.noResults(true);
    } else if (typeof searchState.query !== 'undefined') {
      props.noResults(false);
    }
    return(
      searchResults && searchResults.nbHits !== 0
      ? <CustomHits selectStore={props.selectStore} />
      : <div className="text-danger font-weight-bold small">No stores found - fill in details for {searchState.query} to add it to our database</div>
    )
  }
);

const SearchBox = connectSearchBox(({query, refine, selectedQuery, resetSelectedStore, updateName}) => {
  return(
    <div className="searchbox-container">
      <div className="input-group">
        <input type="text" value={ (typeof selectedQuery==='undefined' || selectedQuery === null) ? query : selectedQuery } onChange={e => refine(e.target.value)} onInput={updateName} onFocus={resetSelectedStore} className="form-control rounded"/>
        <span className="input-group-btn">
          <button className="btn btn-default bg-transparent search-icon">
          <i className="fa fa-search"></i>
          </button>
        </span>
      </div>
    </div>
  )}
);

/**
const Content = connectStateResults(({ searchState, searchResults, props }) =>
   searchResults && searchResults.nbHits !== 0
     ? <Hits hitComponent={Hit}/>
     : <div className="text-danger font-weight-bold small">No stores found - fill in details for {searchState.query} to add it to our database</div>
); 
const Hit = (({hit, selectStore}) => {
  console.log('select store is '+selectStore);
  return(
  <ListGroupItem className="border-0" tag="a" href={selectStore} action>
    {hit.storeName}
  </ListGroupItem>
  );
})
**/

export class AddStore extends Component {
    constructor (props) {
    super(props);

    this.state = { isSearching: false, noResults: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.searchStateChanged = this.searchStateChanged.bind(this);
    this.addNewStore = this.addNewStore.bind(this);
    this.selectStore = this.selectStore.bind(this);
    this.resetSelectedStore = this.resetSelectedStore.bind(this);
  }

  handleSubmit() {
    var validated = true;

    if (this.state.noResults) {
      if (this.state.storeName === "") {
        validated = false;
        this.setState({storeNameValidated: false});
      }

      if (typeof this.state.storeURL === 'undefined' || this.state.storeURL === "") {
        validated = false;
        this.setState({storeURLValidated: false});
      }

      if (typeof this.state.storeDescription === 'undefined' || this.state.storeDescription === "") {
        validated = false;
        this.setState({storeDescriptionValidated: false});
      }

      if (validated) {
        //add to database as a new unapproved store
        var storeID = this.state.storeName;
        storeID = storeID.replace(/\s+/g, '-').toLowerCase();
        this.props.handleSubmit(storeID, this.state.storeName, this.state.storeDescription, this.state.storeURL);
      } 
    } else {
      if (this.state.storeName === "") {
        validated = false;
        this.setState({storeNameValidated: false});
      }

      if (validated) {
        //add to similarStore of the other store
        var newStoreID = this.state.storeName;
        newStoreID = newStoreID.replace(/\s+/g, '-').toLowerCase();
        this.props.handleSubmit(newStoreID, this.state.storeName);
      }
    }
  }

  selectStore(store) {
    this.setState({storeName: store.storeName, storeID: store.storeID, isSearching: false})
  }

  resetSelectedStore() {
    this.setState({storeName: null, storeID: null, isSearching: false})
  }

  searchStateChanged(searchState) {
    this.setState({isSearching: searchState.query !== '' }); 
  }

  addNewStore(show) {
    if (this.state.show !== show) {
      this.setState({noResults: show }); 
    }
  }

  handleNameChange(event) {
    this.setState({storeName: event.target.value});
  }

  handleDescriptionChange(event) {
    this.setState({storeDescription: event.target.value});
  }

  handleURLChange(event) {
    this.setState({storeURL: event.target.value});
  }

  render() {
  return (
	<Card>
		<CardHeader className="border-0">
      <CardTitle className="d-inline">Add New Similar Store for {this.props.storeName}</CardTitle>
      <Button className="close d-inline" onClick={this.props.handleClose}><span aria-hidden="true">&times;</span></Button>
		</CardHeader>
		<CardBody>
      <InstantSearch apiKey="a04e4fe373148200008b5e580198f645" appId="T5C8R2GQUI" indexName="stores" onSearchStateChange={this.searchStateChanged}>
        <SearchBox selectedQuery={this.state.storeName} onReset={this.hideResults} resetSelectedStore={this.resetSelectedStore} updateName={this.handleNameChange} />
        <Fade in={this.state.isSearching} className="card">
          <span className={this.state.isSearching ? "d-block" : "d-none"}>
            <Content noResults={this.addNewStore} selectStore={this.selectStore} />
          </span>
        </Fade>
      </InstantSearch>
      <Fade in={this.state.noResults}>
        <Form className={this.state.noResults ? "d-block" : "d-none"}>
          <FormGroup>
            <Label for="storeURL" size="lg">Store URL</Label>
            <Input type="url" name="url" id="storeURL" placeholder="store url" size="lg" onChange={this.handleURLChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="storeDescription" size="lg">Store Description</Label>
            <Input type="textarea" name="storeDescription" id="storeDescription" placeholder="store description" size="lg" onChange={this.handleDescriptionChange}/>
          </FormGroup>
    	</Form>
      </Fade>
      <Button color="primary" onClick={this.handleSubmit} className={typeof this.state.storeName !== 'undefined' || this.state.noResults ? "d-block mt-3" : "d-none"} >Submit</Button>
  	</CardBody>
	</Card>
  )}
}