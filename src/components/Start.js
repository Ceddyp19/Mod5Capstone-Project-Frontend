import React from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/Start.css'
import './Start.css'

const Start = (props) => {

  const handleClick = () => {
    axios.delete('http://localhost:3000/logout', { withCredentials: true })
      .then(response => {
        props.handleLogout()
        props.history.push('/')
      })
      .catch(error => console.log(error))
  }
  return (

    <div id='start-page'>

      {/* <div class="split left">
        <div class="centered">
        <img src="cafe" alt="Avatar woman"/>
          <p>Some text.</p>
        </div>
      </div>


      <div className='split right'>
        <div className='centered'>
          <Link to='/login'>Log In</Link>
          <br></br>
          <Link to='/signup'>Sign Up</Link>
          <br></br>
        </div>
      </div>

      {
        props.loggedInStatus ?
          <Link to='/logout' onClick={handleClick}>Log Out</Link> :
          null
      } */}
    </div>
  );
};
export default Start;