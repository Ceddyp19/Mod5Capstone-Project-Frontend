// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { Component } from 'react';
import './App.css';
// import SignUp from './signup'  Auth0
// import Login from './login'   Auth0
import Home from './home'
import MainMenu from './mainMenu'
import Translate from './Translate'
import Map from './Map' //transferring new map from other file 
import {
  BrowserRouter,
  Switch,
  Route,
  //  Link,
  // useHistory
} from "react-router-dom";


import Start from './components/Start.js'
import Login from './components/registration/Login.js'
import Signup from './components/registration/Signup.js'



class App extends Component {

  state = {
    username: "",
    email: ""
  }


  logout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }


  setUserState = (username, email) => {
    this.setState({ username: username, email: email})
    console.log(username, email)
  }





  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>



            <Route exact path='/start' render={props => (
            <Start {...props} />
          )} />
          <Route exact path='/login' render={props => (
            <Login {...props} getUserInfo={this.setUserState} />
          )} />
          <Route exact path='/signup' render={props => (
            <Signup {...props} getUserInfo={this.setUserState}/>
          )} />


            {/* Auth0 */}
            {/* <Route exact path='/login'>
              <Login />
            </Route>

            <Route exact path='/signup'>
              <SignUp />
            </Route> */}

            <Route exact path="/mainmenu">
              <MainMenu />
            </Route>

            <Route exact path="/map">
              <Map />
            </Route>

            <Route exact path="/translate">
              <Translate />
            </Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;