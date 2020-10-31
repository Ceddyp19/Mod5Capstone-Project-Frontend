import React from "react";
import { useAuth0 } from "@auth0/auth0-react";         //UNIVERSAL LOGIN

const LogoutButton = () => {
    const { isAuthenticated, logout } = useAuth0();                  //UNIVERSAL LOGIN CODE

    return isAuthenticated && (
        <button onClick={() => {
            logout({ returnTo: window.location.origin });
        }}> Log Out</button> //UNIVERSAL LOGIN CODE

    );
};

export default LogoutButton;