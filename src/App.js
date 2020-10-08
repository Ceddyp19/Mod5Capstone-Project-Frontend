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


import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import SignUp from './signup'
import Login from './login'
import Home from './home'

import {
  BrowserRouter,
  Switch,
  Route,
//  Link,
// useHistory
} from "react-router-dom";


class App extends Component {




  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Home />
              </Route>

            <Route exact path='/login'>
              <Login />
            </Route>

            <Route exact path='/signup'>
              <SignUp />
            </Route>



          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;