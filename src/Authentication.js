// All this code is used to enable an embedded login from Auth0, however I ran into trouble with cookies and cross site authentication,
// So for now, I'll use the univeral method and comment all this code out. In order for the embed login to work correctly, I may have to 
// get the custom domain from Auth0.com to avoid running into the errors...but that's a paid feature, so for now I'm just going to stick to 
// Universal Login
//========================================================================================================
//import { Auth0Lock } from 'auth0-lock';   
//import { Auth0LockPasswordless } from 'auth0-lock';  //Passwordless login feature, not ready to set up yet
// Initializing our Auth0Lock
// export var lock = new Auth0Lock(
//     'YOUR_CLIENT_ID',
//     'YOUR_DOMAIN'
// );

// export var Auth = (function () {

//     var wm = new WeakMap();
//     var privateStore = {};
//     var lock;

//     function Auth() {
//         this.lock = new Auth0Lock(
//             '<YOUR_CLIENT_ID>',
//             '<YOUR_DOMAIN>'
//         );
//         wm.set(privateStore, {
//             appName: "example"
//         });
//     }

//     Auth.prototype.getProfile = function () {
//         return wm.get(privateStore).profile;
//     };

//     Auth.prototype.authn = function () {
//         // Listening for the authenticated event
//         this.lock.on("authenticated", function (authResult) {
//             // Use the token in authResult to getUserInfo() and save it if necessary
//             this.getUserInfo(authResult.accessToken, function (error, profile) {
//                 if (error) {
//                     // Handle error
//                     return;
//                 }

//                 //we recommend not storing Access Tokens unless absolutely necessary
//                 wm.set(privateStore, {
//                     accessToken: authResult.accessToken
//                 });

//                 wm.set(privateStore, {
//                     profile: profile
//                 });

//             });
//         });
//     };
//     return Auth;
// }());


// export {
//     lock,
//     Auth
// }