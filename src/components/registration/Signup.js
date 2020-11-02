import React, { Component } from 'react';
// import axios from 'axios'
import { Link } from 'react-router-dom'
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: ''
    };
  }
  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  };
  handleSubmit = (event) => {
    event.preventDefault()
    const { username, email, password, password_confirmation } = this.state
    let user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }
    fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ user })
    })
      .then(r => r.json())
      .then(data => {
        localStorage.setItem('token', data.jwt)
        this.redirect()
      })
  };
  redirect = () => {
    this.props.getUserInfo(this.state.username, this.state.email)
    this.props.history.push('/mainmenu')
  }
  handleErrors = () => {
    return (
      <div>
        <ul>{this.state.errors.map((error) => {
          return <li key={error}>{error}</li>
        })}
        </ul>
      </div>
    )
  }
  render() {
    const { username, email, password, password_confirmation } = this.state
    return (
      <div className="login-div">
        <div className="login-form-div">
          <h1>Sign Up</h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="textbox">
              <i className="fa fa-user"></i>
              <input
                placeholder="Username"
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
            </div>
            <div className="textbox">
              <i class="fa fa-envelope"></i>
              <input
                placeholder="Email"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </div>
            <div className="textbox">
              <i className="fa fa-lock" aria-hidden='true'></i>
              <input
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className="textbox">
              <i className="fa fa-lock" aria-hidden='true'></i>
              <input
                placeholder="Confirm Password"
                type="password"
                name="password_confirmation"
                value={password_confirmation}
                onChange={this.handleChange}
              />
            </div>
            <button className="btn" placeholder="submit" type="submit">
              Sign Up
          </button>

          </form>
          <div>
            or <Link className="signup-link" to='/login'>login</Link>
          </div>
          <div>
            {
              this.state.errors ? this.handleErrors() : null
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Signup;