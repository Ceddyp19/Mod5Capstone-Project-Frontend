import React, { Component } from 'react';
import {
    //  BrowserRouter,
    //  Switch,
    //  Route,
    Link,
    //  useHistory
} from "react-router-dom";

import './css/Home.css';
import './css/LoginSignupButton.css';



class Home extends Component {
    render() {
        return (
            // <div>
            //     <h1>What would you like to do?</h1><br/>

            //     <Link to="/login">Login</Link><br/><br/>
            //     <Link to="/signup">SignUp</Link>

            //     {/* <a href="/signup">SignUp</a><br/><br/>
            //     <a href="/login">Login</a> */}
            // </div>
            <div id='home-page'>

                <div class="split left">
                    <div class="centered">
                        <img src="home-Image.jpg" alt="Photo by Fred Nassar on Unsplash" />
                        <div class='description-box'><h1>Welcome to <span>TRAVME</span></h1> <h1>Sign In to Continue</h1></div>
                        {/* <p>Some text.</p> */}
                    </div>
                </div>


                <div className='split right'>
                    <div className='centered'>
                        {/* <Link to='/login'>Log In</Link>
                        <br></br>
                        <Link to='/signup'>Sign Up</Link>
                        <br></br> */}
                        <a href='/login' class="horizontal"><span class="text">Login</span></a><a href='/signup' class="vertical"><span class="text">SignUp</span></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;