/* eslint-disable react-in-jsx-scope */
import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'reactstrap'
import { Link } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';

export default class BottomNav extends Component {
  render() {
    return(
      <Navbar className="bottom-nav bg-white" light>
        <Nav className="ml-auto">
          <NavItem>
            <Link to="/add-store">Add a Store</Link>
          </NavItem>

          <NavItem>
            <Link to={`/contact-us`}>Contact Us</Link>
          </NavItem>
          
          <NavItem>
            <Link to={`/terms`}>Terms</Link>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}