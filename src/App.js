import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Route, Switch } from 'react-router-dom'
import * as firebase from "firebase";

import logo from './logo.svg';
import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css'

import TopNav from './TopNav.js'; 
import BottomNav from './BottomNav.js';

import Home from './Home.js'; 
import {Admin} from './Admin/Admin.js'; 
import {StoreDetail} from './StoreDetail.js'; 
import {AddStore} from './AddStore.js'; 
import {Contact} from './Contact.js'; 

import Helmet from 'react-helmet';
import ReactGA from 'react-ga';

var config = {
  apiKey: "AIzaSyBQqZJRrgEtXL2AQjUdM2I4E8fZq5K_Iu4",
  authDomain: "stores-like.firebaseapp.com",
  databaseURL: "https://stores-like.firebaseio.com",
  projectId: "stores-like",
  storageBucket: "stores-like.appspot.com",
  messagingSenderId: "392145730441"
};
firebase.initializeApp(config);

ReactGA.initialize('UA-62683415-1');
ReactGA.pageview(window.location.pathname + window.location.search);

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

class App extends Component {
  render() {
    var addMeta = 
    <Helmet defaultTitle="Stores Like | Find Similar Brands & Stores" titleTemplate="%s | Stores Like" >
      <meta name="description" content="Similar Stores & Brands Searcb" />
    </Helmet>

    return (
      <Container fluid className="master-container">
        {addMeta}
        <TopNav message="" />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/admin" component={Admin}/>
          <Route path="/similar-stores/:id" component={StoreDetail}/>
          <Route path="/add-store" component={AddStore}/>
          <Route path="/contact-us" component={Contact}/>
        </Switch>
        <BottomNav />
      </Container>
    );
  }
}

export default App;