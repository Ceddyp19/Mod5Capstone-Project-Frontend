import React from "react";
// import LogoutButton from "./logoutButton";
// import Profile from "./profile";
import { NavLink } from 'react-router-dom';
// import { useAuth0 } from "@auth0/auth0-react";
// import { useApi } from './use-api';
// import createAuth0Client from '@auth0/auth0-spa-js';
import './mainMenu.css'


const MainMenu = () => {
  // const { user, getAccessTokenSilently } = useAuth0();

  //   const userInfo =  auth0.getUser();
  //   console.log(user);
  // const accessToken = getAccessTokenSilently({audience: 'http://localhost:3000',scope: 'read:users'})
  // console.log(accessToken)

  // useEffect(() => {
  //   const getUser = async () => {

  //     const data = {
  //       email: 'test@email55555.com',
  //       first_name: 'test5555'
  //     }

  //     const auth0 = await createAuth0Client({
  //       domain: 'dev-rez4d2lc.us.auth0.com',
  //       client_id: 'yam3iTtCPpG7Pvkah89pkLaM50HOD8sZ'
  //     });

  //     auth0
  //       .getTokenSilently({audience: 'http://localhost:3000',scope: 'read:users'})
  //       .then(accessToken =>
  //         fetch('http://localhost:3000/users', {
  //           method: 'POST',
  //           headers: {
  //             Authorization: 'Bearer ' + accessToken
  //           },
  //           body: JSON.stringify(data)
  //         })
  //       )
  //       .then(result => result.json())
  //       .then(data => {
  //         console.log(data);
  //       });
  //   }
  //   getUser();
  // }, []);
  /////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   const opts = {
  //     audience: 'http://localhost:3000',  //This is used to access api on backend...values are given at Auth0.com
  //     scope: 'read:users',
  //   };


  //   //   const accessToken = getAccessTokenSilently(opts) // get access token using opts

  //   //   console.log(accessToken)
  //   //   console.log(user)
  //   const data = {
  //     uid: '54235849',
  //     email: 'test@email.com',
  //     first_name: 'tested',
  //     last_name: 'testing',
  //     image: 'bkajdska'
  //   }
  //   //   // const data = {
  //   //   //   uid: user.sub,
  //   //   //   email: user.email,
  //   //   //   first_name: user.given_name,
  //   //   //   last_name: user.family_name,
  //   //   //   image: user.picture
  //   //   // };

  //   //   fetch('http://localhost:3000/users', {               //making the fetch request to our Api to Authenticate on backend
  //   //     method: 'POST',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //       'Accept': 'application/json'
  //   //       // authorization: `Bearer ${accessToken}`
  //   //     },
  //   //     body: JSON.stringify(data)
  //   //   })
  //   //     .then(response => response.json())
  //   //     .then(data => {
  //   //       console.log('Success:', data);
  //   //     })
  //   //     .catch((error) => {
  //   //       console.error('Error:', error);
  //   //     });

  //   // }, []);



  //   const fetchUsers = () => {
  //     fetch('http://localhost:3000/users', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: JSON.stringify({ email: 'test@email.com22gjgu2' })
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log('Success:', data);
  //       })
  //   };
  //   fetchUsers();

  // }, []);


  return (
    <div id='background'>
      {/* <Profile /> */}
      {/* <LogoutButton /> */}
      {/* <Link to="/map">Map</Link><br /><br /> */}
      <div id='mainmenudiv'>
        <div id='apptitle'>App Title</div><br />
        <div id='mapdiv' className="buttondiv">
          <NavLink to='/map' className='mainmenubuttons' exact>Map</NavLink><br />
        </div>
        <div id='translatediv' className="buttondiv">
          <NavLink to='/translate' className='mainmenubuttons' exact>Translate</NavLink><br />
        </div>
        <div id='conversediv' className="buttondiv">
          <NavLink to='/converse' className='mainmenubuttons' exact>Converse</NavLink><br />
        </div>
      </div>
      {/* <button>Translate</button>
      <button>Converse</button> */}
    </div>
  )
};

export default MainMenu;


{/* <div className='shift'>
              <NavLink className="link"
                to="/movies"
                exact >
              <li  > Movies </li></NavLink> */}













// const data2 = {   user: {
//   email: 'test2@example.com',
//   password: 'anewpassword2',
//   password_confirmation: 'anewpassword2'
// } };

// fetch('http://localhost:3000/users', {
// method: 'POST', 
// headers: {
//   'Content-Type': 'application/json',
// authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkR2a1VMWngxWUFoUlB2Vm51YzgyVCJ9.eyJpc3MiOiJodHRwczovL2Rldi1yZXo0ZDJsYy51cy5hdXRoMC5jb20vIiwic3ViIjoiTDRqNUdWdkxVVkl3b2E3aHlRT1NOdGZ4OVc5cTNuSGdAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImlhdCI6MTYwMjQ0Nzk2MCwiZXhwIjoxNjAyNTM0MzYwLCJhenAiOiJMNGo1R1Z2TFVWSXdvYTdoeVFPU050Zng5VzlxM25IZyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.j6qroC7ZOJzKz4KTwBTlXCo8qV6m_nZp1o0ywpum6yLh9hQcngWpKZeqgvtMHfBhEGimAISURgKGrQb1SP-BLS_MLfCewjO2u7ASuWfAJ6uWVev2PXTg9OJ5YmYMhXaVpHNp6R5WG10zlUjuLnbPHOPWCZuoVrBYZPvxmY8k8vGgK_Ze8IuQ5qxoEP5impNb-9VGVOAaQ4wri3qUkkvDiB-JpgzkJudWTzuOtAy0OR_6z0q7UpxXOHPXpndi96UxAUdv3dDaw8glCwOsCJjcApmEbM7r4qpjE37TpXvPBRngVIyVimYubB14r6OT1rD6twkEhUnNdftOWxWS_64mPw'
// },
// body: JSON.stringify(data2),
// })
// .then(response => response.json())
// .then(data => {
// console.log('Success:', data2);
// })
// .catch((error) => {
// console.error('Error:', error);
// });