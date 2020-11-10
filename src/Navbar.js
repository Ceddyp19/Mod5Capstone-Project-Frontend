import React from 'react'
import { NavLink, Link } from 'react-router-dom';
//NavLink highlights which link is currently click and Link doesn't
import './css/Navbar.css';
// import './components/icons/mainLogo1.png';



// const pic = require('./components/icons/mainLogo1.png');


class Navbar extends React.Component {
    render() {
        // console.log(this.props)
        return (


            <div className='navbar'>

                <Link
                    to="/mainmenu"
                    /* set exact so it knows to only set activeStyle when route is deeply equal to link */
                    exact
                    id='home-logo'
                >

                    <img className='img-logo' src='logo-small.png' alt="" /> 
                </Link>

                <div className='page-links-div'>
                    <NavLink className="link"
                        to="/map"
                        exact >
                        <li  > Map </li></NavLink>


                    <NavLink className='link'
                        to="/translate"
                        exact >
                        <li> Translate </li></NavLink>


                    <NavLink className='link'
                        to="/converse"
                        exact >
                        <li> Converse </li> </NavLink>
                </div>

                <div id='user-icon' className='dropdown fa fa-user-circle fa-2x'>
                    <div className="dropdown-content">
                        {/* <h5 className="use">User: {this.props.username}</h5>
                                    <h5 className="email-text">Email: {this.props.email}</h5> */}
                        <h4 onClick={() => this.props.logout()}>Logout</h4>
                        <h4 onClick={() => this.props.deleteUser()}>Delete Account</h4>
                    </div>

                </div>
            </div>

        )
    }
}

export default Navbar;