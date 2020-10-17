import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";                     //UNIVERSAL LOGIN

ReactDOM.render(
  <Auth0Provider                                                        //UNIVERSAL LOGIN CODE
    domain="dev-rez4d2lc.us.auth0.com"
    clientId="yam3iTtCPpG7Pvkah89pkLaM50HOD8sZ"
    redirectUri={window.location.origin + '/mainmenu'}
    audience="https://dev-rez4d2lc.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
    useRefreshTokens={true}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>,                                                     //UNIVERSAL LOGIN CODE
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
