/* esli nt-disable react-in-jsx-scope */
import React, { Component } from 'react'
import { Navbar, NavbarBrand } from 'reactstrap';
import logoImage from './images/stores-like-logo.png'; // Tell Webpack this JS file uses this image

class TopNav extends Component {

  render() {
    return(
      <Navbar className="fixed-top top-nav">
        <NavbarBrand href="/"><img src={logoImage} alt="Stores Like Logo" /></NavbarBrand>
      </Navbar>
    )
  }
}

export default TopNav;