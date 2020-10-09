import React from "react";
 import { useAuth0 } from "@auth0/auth0-react";   //UNIVERSAL LOGIN (TAKES USER TO ANOTHER URL TO LOGIN)

//import {lock, Auth} from './Authentication' // EMBEDDED LOGIN (USER LOGS IN ON MY APP)


const LoginButton = () => {

    const { loginWithRedirect } = useAuth0(); //UNIVERSAL LOGIN CODE

    return <button onClick={() => loginWithRedirect()}> Auth0 Log In</button>;     //UNIVERSAL LOGIN CODE
    // return <button onClick={() => lock.show()}> Auth0 Log In</button>;  //EMBEDDED LOGIN CODE
};

export default LoginButton;