import React, { Component } from 'react';
import './css/Converse.css'
import Navbar from './Navbar';

class Converse extends Component {
    state = {  }
    render() { 
        return ( 
        <>
         <Navbar deleteUser={this.deleteUser} username={this.state.username} email={this.state.email} logout={this.logout} />
        <div id='converse-page'>This is the converse page</div> 
        </>
        );
    }
}
 
export default Converse;