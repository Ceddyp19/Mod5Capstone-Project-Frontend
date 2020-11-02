import React, { Component } from 'react';
// import axios from 'axios'
import { Link } from 'react-router-dom'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
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
    const { username, email, password } = this.state
    let user = {
      username: username,
      email: email,
      password: password
    }
    fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ user })
    }).then(res => res.json()).then(data => {
      localStorage.setItem('token', data.jwt)
      console.log(data)
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
        <ul>
          {this.state.errors.map(error => {
            return <li key={error}>{error}</li>
          })}
        </ul>
      </div>
    )
  }
  render() {
    const { username, email, password } = this.state
    return (
      <div className="login-div">
        <div className="login-form-div">
          <h1>Login</h1>
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
            <button className="btn" placeholder="submit" type="submit">
              Login
          </button>
            <div>
              or <Link className="signup-link" to='/signup'>sign up</Link>
            </div>

          </form>
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
export default Login;

// axios.post('http://localhost:3000/login', {user}, {withCredentials: })
//     .then(response => {
//       if (response.data.logged_in) {
//         this.props.handleLogin(response.data)
//         this.redirect()
//       } else {
//         this.setState({
//           errors: response.data.errors
//         })
//       }
//     })
//     .catch(error => console.log('api errors:', error))