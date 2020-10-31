import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import JSONPretty from 'react-json-pretty';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  //console.log(user)


  //Code to access my protected API...couldn't figure out how to work it yet so I went back to using unprotected APIs
  // useEffect(() => {
  //   const getUser = async () => {
  
  //     try {
  //       // const data = {
  //       //       email: 'test@email.com',
  //       //       first_name: 'test'
  //       //     }

  //       const accessToken = await getAccessTokenSilently({
  //         audience: `http://localhost:3000`,
  //         scope: "read:users",
  //       });
  
  //       const getUserUrl = `http://localhost:3000/users`;
  
  //       const metadataResponse = await fetch(getUserUrl, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         // body: JSON.stringify(data)
  //       });
  
  //       const { user_metadata } = await metadataResponse.json();
  //       console.log(user_metadata)
  
  //       // setUserMetadata(user_metadata);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   };
  
  //   getUser();
  // }, []);



  //this is for the example on Auth0 to access protected APIs
  // useEffect(() => {
  //   // console.log(getAccessTokenSilently({
  //   //   audience: `https://dev-rez4d2lc.us.auth0.com/api/v2/`,
  //   //   scope: "read:current_user"}));

  //   const getUserMetadata = async () => {
  //     const domain = "dev-rez4d2lc.us.auth0.com";
  
  //     try {
  //       const accessToken = await getAccessTokenSilently({
  //         audience: `https://${domain}/api/v2/`,
  //         scope: "read:current_user",
  //       });
         
  //       const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  
  //       const { user_metadata } = await metadataResponse.json();
  
  //       setUserMetadata(user_metadata);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   };
  
  //   getUserMetadata();
  // }, []);

 

  return (
    isAuthenticated && (
      <div>
         {/* {console.log(user.email)} */}
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        <JSONPretty data={user} />
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default Profile;


//withAuth0 is for classes and useAuth0 is for hooks 
// import React, { Component } from 'react';
// import { withAuth0 } from '@auth0/auth0-react';

// class Profile extends Component {
//   render() {
//     const { user } = this.props.auth0;
//     return <div>Hello {user.name}</div>;
//   }
// }

// export default withAuth0(Profile);