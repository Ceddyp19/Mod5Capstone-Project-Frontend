//============================================My Imports======================================================
import './css/Map.css';
import './css/SideBar.css'
import './css/AddMemoryPopUpWindow.css'
import './css/DetailsPopUpWindow.css'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Navbar from './Navbar';

import UserMarkers from './markers/renderUserMarker';
import AttractionMarkers from './markers/attractionMarkers';
import CafeMarkers from './markers/cafeMarkers';
import GymMarkers from './markers/gymMarkers.js';
import HospitalMarkers from './markers/hospitalMarkers';
import LodgingMarkers from './markers/lodgingMarkers';
import NightClubMarkers from './markers/nightClubMarkers';
import ResturantMarkers from './markers/resturantMarkers';
import ShoppingMallMarkers from './markers/shoppingMallMarkers';
import SuperMarketMarkers from './markers/superMarketMarkers';
import TransitMarkers from './markers/transitMarkers';


import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    useLoadScript,
    InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";


import * as mapStyles from './mapStyles';
import Tabs from "./Tabs";
import PlacesAutocomplete from './PlacesAutocomplete'
import DropDown from './dropDown';
import MapStyleDropDown from './mapStyleDropDown'
import MultiImageInput from 'react-multiple-image-input';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { ReactPhotoCollage } from "react-photo-collage";

//=================================================================My Global Variables===============================================================================
const libraries = ["places"];
const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
};
const center = {
    lat: 35.689487,
    lng: 139.691711,
}
const DESTINATIONS_URL = "http://localhost:3000/destinations"
const USER_DESTINATIONS_URL = "http://localhost:3000/user_destinations"
const COLLAGES_URL = "http://localhost:3000/collages"
const currentUserDestinations = []; //too many rerenders when trying to use state, so I saved all filtered destinations into this variable and render this instead
const collageSettings = []; //same reason as line 66; holds settings for each collage

//==================================================================My Map Component=========================================================
export default function Map(props) {
    useEffect(() => {
        fetchData();
        setTimeout(() => fetchCollages(), 2500);
    }, []);

    //**************State Hooks***************************/
    const [nameValue, setNameValue] = useState('');  //set the input value of Name of Place as person types
    const [storyValue, setStoryValue] = useState('');  //set the input value of Story of add memory modal as person types
    const [dateValue, setDateValue] = useState('');  //set the input value of Date of add memory modal 
    const [imageUrlValue, setImageUrlValue] = useState('');  //set the input value of image
    const [destinations, setDestinations] = useState([]);  //holds all destinations created by all users of app
    const [renderDestinations, setRenderDestinations] = useState([]); //holds filtered destinations that pertain to specific user
    //const [favorited, setFavorited] = useState([]);  //holds favorited destinations list
    //const [wantToGo, setWantToGo] = useState([]);    //holds Want2Go destinations list
    //const [visited, setVisited] = useState([]);      //holds Visited destinations list
    const [images, setImages] = useState({});  //used for image upload
    const [collages, setCollages] = useState([]); //holds all pictures setting of each collage
    const [currentVisitedDestination, setCurrentVisitedDestination] = useState(null);  // this state is used to keep track of the currently selected visited destination that a collage/Memory Album is being added to
    // don't need I think const [currentDetailsWindow, setCurrentDetailsWindow] = useState(null); // keeps track of which details Modal is being veiwed so correct collage info is shown
    const [allCollages, setAllCollages] = useState(null); //holds all the persisted collages when fetching after component mounts 
    const [currentlyViewedCollage, setCurrentlyViewedCollage] = useState(''); //the collage details the user is currently, found by filtering through allCollages
    const [currentlyViewedCollagePhotos, setCurrentlyViewedCollagePhotos] = useState([]); //since the photos data in each Collage isn't formatted properly, I must reformate them and place the photos in seprate state
    const [currentlyViewedCollageStory, setCurrentlyViewedCollageStory] = useState(''); //when user edits story, the edited collage story will be rendered 
    const [editMode, setEditMode] = useState(false); // switches details popup window to edit mode 

    const [mapStyle, setMapStyle] = useState(mapStyles.mutedBlue) //preset map style
    const [selectedDefaultMarker, setSelectedDefaultMarker] = React.useState(null);
    const [selectedCreatedMarker, setSelectedCreatedMarker] = React.useState(null);
    //***************Variables*************************************/
    const options = {                     //map options
        styles: mapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true
    }


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries,
    });

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    //pans to the location that the user selects
    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        //mapRef.current.setzoom(14);
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };

    //***************Functions*****************************************/

    function toggleForm() {
        let coll = document.getElementsByClassName("form-drop-down");
        let i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    }

    function openNav() {
        let mySideBar = document.getElementById("mySideBar")
        mySideBar.style.width = "25%";
        mySideBar.style.paddingLeft = "4%";
        mySideBar.style.paddingRight = "4%";
        document.getElementsByClassName("openbtn")[0].style.left = '27%';

    }

    function closeNav(e) {
        e.preventDefault();
        let mySideBar = document.getElementById("mySideBar")
        mySideBar.style.width = "0";
        mySideBar.style.paddingLeft = "0%";
        mySideBar.style.paddingRight = "0%";
        let openbtn = document.getElementsByClassName("openbtn")[0]
        openbtn.style.left = '-0px';

    }

    function handleNameInput(event) {
        setNameValue(event.target.value);   //handles user input in form 
    }

    function handleImageInput(event) {
        setImageUrlValue(event.target.value);   //handles user input in form 
    }

    //when a user adds a created destination to their map, this functions saves that to the Destinations model in the database. The Destinations model represents 
    //all the destinations created by all users, then addUserDestination is called in order to persist destinations unique to a particular user. 
    //The UserDestinations data should then be loaded into the destinations state hook whenever the component is first mounted using the useEffect hook 
    function addDestination(e) {
        e.preventDefault();
        //console.log('it works!', e.target.autocomplete.value)

        let name = e.target.name.value
        let image = e.target.image.value
        let address = e.target.autocomplete.value

        setNameValue('')
        setImageUrlValue('')

        getGeocode({ address: address })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                //console.log(" I grabbed the Coordinates on Submit!", { lat, lng });

                //adding new destination to state on frontend
                currentUserDestinations.push([...currentUserDestinations, { name: name, image: image, addr: address, lat: lat, lng: lng }])
                setRenderDestinations([...renderDestinations, { name: name, image: image, addr: address, lat: lat, lng: lng }])
                setDestinations([...destinations, { name: name, image: image, addr: address, lat: lat, lng: lng }])
                //persisting new destination on backend
                fetch(DESTINATIONS_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "name": name,
                        "image": image,
                        "lng": lng,
                        "lat": lat,
                        "addr": address
                    })
                })//.then(res => console.log(res))

                setTimeout(() => addUserDestination(address), 2000)
            })
            .catch((error) => {
                console.log("😱 Error: ", error);
            });

    }

    function addUserDestination(address) {
        //the address attribute is used to find the correct destination on the rails backend...once found, I use the id to create the UserDestination
        function it(address) {
            fetch(USER_DESTINATIONS_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `JWT ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "addr": address
                })
            })//.then(res => console.log(res))
        }
        setTimeout(() => it(address), 3000)
    }


    function fetchData() {

        let Userdes = [];
        let Des = [];

        function fetchDestinations() {
            //fetches all saved destinations that all users have created
            if (localStorage.getItem("token")) {
                fetch(DESTINATIONS_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem("token")}`
                    }
                }).then(res => res.json()).then(data => {
                    //the code on line below is essential for rendering the markers upon render
                    setDestinations(prevDestinations => ([...data])) //does same as setDestinations(data)

                    //console.log(data.map(d => d.id))
                    // console.log(data)
                    // console.log(destinations)
                    Des = data

                })
            }
        }

        function fetchUserDestinations() {
            //fetches user specific destinations that will be used to filter destinations before rendering 
            if (localStorage.getItem("token")) {
                fetch(USER_DESTINATIONS_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem("token")}`
                    }
                }).then(res => res.json()).then(data => {

                    // console.log(data)
                    // setUserDestinations(data)
                    Userdes = data

                }
                )
            }
        }

        function renderUserDestinations() {
            // console.log(Userdes)
            // console.log(Des)

            Userdes.forEach((ud) => {
                Des.forEach((d) => {
                    if (ud.destination_id === d.id) {
                        d.listCategory = ud.listCategory
                        currentUserDestinations.push(d)
                    }
                })
            })
            setRenderDestinations([...renderDestinations, ...currentUserDestinations])
        }

        // function fetchCollages() {


        //     if (localStorage.getItem("token")) {
        //         fetch(COLLAGES_URL, {
        //             method: "GET",
        //             headers: {
        //                 'Authorization': `JWT ${localStorage.getItem("token")}`
        //             }
        //         }).then(res => res.json()).then(data => {

        //             setAllCollages(data);
        //             // console.log(data)
        //             //creates the setting for each Collage of user
        //             data.forEach((d) => {
        //                 let photos = d.photos
        //                 let formattedPhotos = [];
        //                 // console.log('this is photos', photos)
        //                 // console.log('this is photos', photos.split(" "))

        //                 //with the way that the photos data is, I must:
        //                 // 1) split the photos data to go from away to string,
        //                 // 2) filter out the elements that aren't photo urls.
        //                 // 3) push filtered photos into an array [to avoid too many rerenders error]
        //                 // 4) add formatted photos array as photos value in setting
        //                 // 5) push setting into collageSetting [to avoid too many rerenders error]
        //                 // 6) update collages state with collageSettings
        //                 photos = photos.split(" ")
        //                 photos = photos.filter((ph) => {
        //                     return ph[0] === 'd'
        //                 })

        //                 for (const photo of photos) {
        //                     formattedPhotos.push({ src: photo })
        //                 }

        //                 // console.log(formattedPhotos)

        //                 const setting = {
        //                     width: '200px',
        //                     height: ['100px', '60px'],
        //                     layout: [1, 3],
        //                     photos: formattedPhotos,
        //                     showNumOfRemainingPhotos: true,
        //                     userDestinationId: d.user_destination_id,
        //                     id: d.id
        //                 };

        //                 // Object.keys(currentImages).map(function (keyName, keyIndex) {
        //                 //     photos.push({ src: currentImages[keyName] })
        //                 // })

        //                 collageSettings.push(setting);
        //             })
        //             setCollages(collageSettings)
        //         })
        //     }
        //     // console.log(collageSettings)
        // }


        fetchDestinations();
        fetchUserDestinations();
        setTimeout(() => renderUserDestinations(), 2000);
        // setTimeout(() => fetchCollages(), 2500);

    }

    function fetchCollages() {


        if (localStorage.getItem("token")) {
            fetch(COLLAGES_URL, {
                method: "GET",
                headers: {
                    'Authorization': `JWT ${localStorage.getItem("token")}`
                }
            }).then(res => res.json()).then(data => {

                setAllCollages(data);
                // console.log(data)
                //creates the setting for each Collage of user
                data.forEach((d) => {
                    let photos = d.photos
                    let formattedPhotos = [];
                    // console.log('this is photos', photos)
                    // console.log('this is photos', photos.split(" "))

                    //with the way that the photos data is, I must:
                    // 1) split the photos data to go from away to string,
                    // 2) filter out the elements that aren't photo urls.
                    // 3) push filtered photos into an array [to avoid too many rerenders error]
                    // 4) add formatted photos array as photos value in setting
                    // 5) push setting into collageSetting [to avoid too many rerenders error]
                    // 6) update collages state with collageSettings
                    photos = photos.split(" ")
                    photos = photos.filter((ph) => {
                        return ph[0] === 'd'
                    })

                    for (const photo of photos) {
                        formattedPhotos.push({ src: photo })
                    }

                    // console.log(formattedPhotos)

                    const setting = {
                        width: '200px',
                        height: ['100px', '60px'],
                        layout: [1, 3],
                        photos: formattedPhotos,
                        showNumOfRemainingPhotos: true,
                        userDestinationId: d.user_destination_id,
                        id: d.id
                    };

                    // Object.keys(currentImages).map(function (keyName, keyIndex) {
                    //     photos.push({ src: currentImages[keyName] })
                    // })

                    collageSettings.push(setting);
                })
                setCollages(collageSettings)
            })
        }
        // console.log(collageSettings)
    }


    function addToList(destination, listName) {
        // iterating over renderDestinations state instead of destinations 
        //inorder to only add user specific destinations to a list

        const newDestinations = renderDestinations.map((d) => {
            const newDestination = { ...d }
            if (destination.name === d.name) {
                newDestination.listCategory = listName
                fetch(`${USER_DESTINATIONS_URL}/${destination.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "listCategory": listName,
                        "addr": destination.addr
                    })
                })
            }
            return newDestination;
        })

        setRenderDestinations(newDestinations);

        // switch (listName) {
        //     case "Favorite":
        //         console.log(marker.name + ' added to ' + listName)
        //         break;
        //     case "Want to Go":
        //         console.log(marker.name + ' added to ' + listName)
        //         break;
        //     case "Visited":
        //         console.log(marker.name + ' added to ' + listName)
        //         break;
        //     default:
        //         console.log('Error, List not found')
        // }
    }

    function deleteFromList(destination) {                       //deletes marker from list 

        //remove from frontend
        const newDestinations = destinations.map((d) => {
            const newDestination = { ...d }
            if (destination.name === d.name) {
                newDestination.listCategory = undefined
            }
            return newDestination;
        })

        setDestinations(newDestinations);

        //remove from backend 
        fetch(`${USER_DESTINATIONS_URL}/${destination.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "listCategory": null,
                "addr": destination.addr
            })
        })
        // }

    }

    function deleteFromAllLists(destination) {
        //removes offscreen from frontend
        const currentDestinations = renderDestinations.filter((d) => d.name !== destination.name)
        setRenderDestinations(currentDestinations)

        //===================================================================================
        //_____________________________________________________________________________________________________
        //deletes on backend
        //first, had to find User_Destination Instance with the same matching destination id attribute
        //so I'll know I'm deleting the correct user_destination instance from database

        //First Method, if backend didn't know user id, I would have to find user_destination id directly
        // fetch(USER_DESTINATIONS_URL, {
        //     method: "GET",
        //     headers: {
        //         'Authorization': `JWT ${localStorage.getItem("token")}`
        //     }
        // }).then(res => res.json()).then(data => {
        //     let ans;
        //     ans = data.find(d => d.destination_id === destination.id)
        //     console.log(ans)
        //     console.log(ans.id)

        //        fetch(`${USER_DESTINATIONS_URL}/${ans.id}`, {
        //         method: 'DELETE',
        //         headers: {
        //             'Authorization': `JWT ${localStorage.getItem("token")}`
        //             }
        //     })

        // })
        //_____________________________________________________________________________________________________
        //better solution; since backend already knows the user id, I can just use destination id instead of finding user_destination id 
        //because user_destination id is found on backend using destination/user id pair
        fetch(`${USER_DESTINATIONS_URL}/${destination.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${localStorage.getItem("token")}`
            }
        })
    }

    function StyleMap() {                                   //set map style state hook
        const changeStyle = (style) => {
            setMapStyle(mapStyles[style])
        }
        return <MapStyleDropDown changeStyle={changeStyle} />
    }

    function toggleMemoryPopUpWindow(destinationId) {

        setCurrentVisitedDestination(destinationId)
        const modal = document.querySelector(".modal")
        const closeBtn = document.querySelector(".close")
        modal.style.display = "block";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        })
    }

    function toggleDetailsPopUpWindow(userDestinationId, collageId) {
        //finding currently viewed collage by userDestinationId
        let currentCollage = allCollages.find(c => c.user_destination_id === userDestinationId & c.id === collageId)
        //changing format of photos
        console.log(userDestinationId)
        console.log(collages)
        console.log(allCollages)
        console.log(collageId)

        console.log(currentCollage)
        console.log(currentCollage.photos)
        let photos = currentCollage.photos
        photos = photos.split(" ")
        photos = photos.filter(ph => (ph[0] === 'd'))
        setCurrentlyViewedCollage(currentCollage)
        setCurrentlyViewedCollagePhotos(photos)
        setCurrentlyViewedCollageStory(currentCollage.story)
        // console.log(currentlyViewedCollagePhotos)

        const modal = document.querySelector(".details-modal")
        const closeBtn = document.querySelector(".details-close")
        modal.style.display = "block";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        })
    }
    // console.log(collages)



    function addMemory(e) {
        e.preventDefault();
        let userDestinationId = currentVisitedDestination
        let currentImages = images
        let photos = []

        //===============================================================================
        // Frontend Rendering
        //use this to get rid array of arrays in currentImages and return just array of image urls, then pass photos to settings
        Object.keys(currentImages).map(function (keyName, keyIndex) {
            photos.push({ src: currentImages[keyName] })
        })

        const setting = {
            width: '200px',
            height: ['100px', '60px'],
            layout: [1, 3],
            photos: photos,
            showNumOfRemainingPhotos: true,
            userDestinationId: userDestinationId
        };
        setCollages([...collages, setting])


        //=================================================================================
        // Persistence on backend
        fetch(USER_DESTINATIONS_URL, {
            method: "GET",
            headers: {
                'Authorization': `JWT ${localStorage.getItem("token")}`
            }
        }).then(res => res.json()).then(data => {

            let ud = data.find(d => d.destination_id === userDestinationId)
            let newPhotos = [];
            photos.forEach((photo) => newPhotos.push(` ${photo.src} `))

            fetch(COLLAGES_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `JWT ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "photos": newPhotos,
                    "story": storyValue,
                    "date": dateValue,
                    "user_destination_id": ud.id
                })
            })

            // let newCollage = {
            //     photos: newPhotos,
            //     story: storyValue,
            //     date: dateValue,
            //     user_destination_id: ud.id
            // }

            // setAllCollages([...allCollages, newCollage])
        })
        // setTimeout(() => fetchCollages(), 30000);
    }

    function editMemory(e) {
        e.preventDefault();
        let story = e.target.story.value
        console.log('it works!!', e.target.story.value)
        // Persistence on backend
        fetch(`${COLLAGES_URL}/${currentlyViewedCollage.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "story": story
            })
        })
        //Rendering on Frontend
        setCurrentlyViewedCollageStory(story)
        setEditMode(!editMode)
    }

    function deleteMemory(e) {
        e.preventDefault();
        console.log('deletion')
        // Deletion on Backend
        fetch(`${COLLAGES_URL}/${currentlyViewedCollage.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${localStorage.getItem("token")}`
            }
        })

        // Update on frontend
        let updatedCollages = collages.filter(c => c.id !== currentlyViewedCollage.id)
        setCollages(updatedCollages)
        // Close popup window
        const modal = document.querySelector(".details-modal")
        modal.style.display = "none";
    }


    //lists for each category shown in side panel
    const favoritedDestinations = renderDestinations.filter(destination => destination.listCategory === 'Favorite')
    const wantToGoDestinations = renderDestinations.filter(destination => destination.listCategory === 'Want to Go')
    const visitedDestinations = renderDestinations.filter(destination => destination.listCategory === 'Visited')
    //********************Returned Component Values**************************************/
    return (
        <div id='map-page'>
            <Navbar deleteUser={props.deleteUser} username={props.username} email={props.email} logout={props.logout} />
            <div className='page'>
                <div className="modal">
                    <div className="modal_content">
                        <span className="close">&times;</span>
                        <h2>Memory</h2>
                        <h3>Images</h3>
                        <MultiImageInput
                            max={12}
                            images={images}
                            setImages={setImages}
                            cropConfig={{ crop, ruleOfThirds: true }}
                        />
                        <form onSubmit={addMemory}>
                            <label >
                                Tell Your Story:<br />
                                <textarea name='story' id='story' rows='5' cols='33' value={storyValue} onChange={e => setStoryValue(e.target.value)}></textarea>
                            </label><br /><br />
                            <label >
                                Date:<br />
                                <input type="date" name="date" value={dateValue} onChange={e => setDateValue(e.target.value)} />
                            </label><br /><br />

                            <input type="submit" value="Submit" />

                        </form>
                    </div>
                </div>

                <div className="details-modal">
                    {/* {console.log(currentlyViewedCollagePhotos)} */}
                    <div className="details_modal_content">
                        <span className="details-close">&times;</span>

                        {editMode ? (
                            <>
                                <h2>Edit Story</h2>
                                <h3>Images</h3>
                                {/* <MultiImageInput
                            max={12}
                                images={images}
                                setImages={setImages}
                                cropConfig={{ crop, ruleOfThirds: true }}
                            /> */}
                                <form onSubmit={editMemory}>
                                    <label >
                                        Story:<br />
                                        <textarea name='story' id='story' rows='5' cols='33' placeholder={currentlyViewedCollage.story} value={storyValue} onChange={e => setStoryValue(e.target.value)}></textarea>
                                    </label><br /><br />
                                    {/* <label >
                                    Date:<br />
                                    <input type="date" name="date" placeholder={currentlyViewedCollage.date} value={dateValue} onChange={e => setDateValue(e.target.value)} />
                                </label><br /><br /> */}

                                    <input type="submit" value="Submit" />

                                </form>

                                <button onClick={() => {
                                    setEditMode(!editMode)
                                    setImages({})
                                }
                                }>Cancel</button>
                            </>
                        )
                            :
                            (
                                <>
                                    <h2>Details</h2>
                                    <h3>{currentlyViewedCollage.date}</h3>
                                    <h5>{currentlyViewedCollageStory}</h5>

                                    <CarouselProvider
                                        naturalSlideWidth={28}
                                        naturalSlideHeight={15}
                                        orientation="horizontal"
                                        totalSlides={currentlyViewedCollagePhotos.length}
                                        visibleSlides={1}
                                        step={1}
                                        infinite={true}
                                    >

                                        <div className='details-carousel'>
                                            <div className="details-slider">
                                                <Slider key={currentlyViewedCollage.date} >
                                                    {currentlyViewedCollagePhotos.map((photoUrl, index) => <Slide className='details-slide' key={index} index={index}><img src={photoUrl} alt="image" width='325' height='300' /></Slide>)}
                                                </Slider>
                                            </div>

                                            <div className="control-btn backbutton">
                                                <ButtonBack className='arrow-buttons fa fa-angle-left'></ButtonBack>
                                            </div>

                                            <div className="control-btn nextbutton">
                                                <ButtonNext className="arrow-buttons fa fa-angle-right"></ButtonNext>
                                            </div>
                                        </div>

                                    </CarouselProvider>

                                    <button onClick={() => setEditMode(!editMode)}>Edit</button>
                                    <button onClick={deleteMemory}>Delete</button>
                                </>
                            )}
                    </div>
                </div>


                {/* <h1 id='Logo'>Logo here!!</h1> */}

                <div id='main'>
                    <button className='openbtn' onClick={openNav}>☰</button>
                </div>
                <div id='mySideBar'>
                    <button className="closebtn" onClick={closeNav}>×</button>


                    <button className='form-drop-down' onClick={toggleForm}>Add Destination</button>
                    <div className='content'>

                        <div className='form-div'>
                            <form onSubmit={addDestination}>
                                <label className='place-input'>
                                    Name of Place<br />
                                    <input type="text" name="name" placeholder="What's the Name?" value={nameValue} onChange={handleNameInput} />
                                </label><br /><br />
                                <label className='image-input'>
                                    Url Image<br />
                                    <input type="text" name="image" placeholder="Paste Image Url" value={imageUrlValue} onChange={handleImageInput} />
                                </label><br /><br />
                                <label className='location-input'>
                                    Location<br />
                                    <PlacesAutocomplete />
                                </label>
                                <input className='submit-btn' type="submit" value="Submit" />

                            </form>
                        </div>

                    </div>
                    <Tabs>
                        <div label="All">
                            {
                                renderDestinations.map((destination) => (
                                    <div key={destination.name}>

                                        <div className="destination-details">
                                            <h2>{destination.name}</h2>
                                            <img src={destination.image} alt={destination.name} />
                                            <p>{destination.addr}</p>
                                            <button onClick={() => deleteFromAllLists(destination)}>Delete</button>
                                        </div>
                                        <br />
                                        <br />
                                        <hr />
                                    </div>

                                ))
                            }
                        </div>

                        <div label="Want2Go">
                            {wantToGoDestinations.map((destination, index) => (
                                <div key={index}>

                                    <div className="destination-details">
                                        <h2>{destination.name}</h2>
                                        <img src={destination.image} alt={destination.name} />
                                        <p>{destination.addr}</p>
                                        <button onClick={() => deleteFromList(destination)}>Delete</button>
                                    </div>
                                    <br />
                                    <br />
                                    <hr />
                                </div>

                            ))}
                        </div>


                        <div label="Visited">
                            {visitedDestinations.map((destination, index) => (
                                <div key={index} >

                                    <div className="destination-details">
                                        <h2>{destination.name}</h2>
                                        <img src={destination.image} alt={destination.name} />
                                        <p>{destination.addr}</p>
                                        <button onClick={() => deleteFromList(destination)}>Delete</button>
                                        <button onClick={() => toggleMemoryPopUpWindow(destination.id)}>Add Memory</button>
                                    </div>

                                    <CarouselProvider
                                        naturalSlideWidth={38}
                                        naturalSlideHeight={35}
                                        orientation="horizontal"
                                        totalSlides={collages.filter((collage) => destination.id === collage.userDestinationId).length}
                                        visibleSlides={1}
                                        step={1}
                                        infinite={true}
                                    >

                                        <div className='carousel'>
                                            <div  id='backbutton' className="control-btn backbutton">
                                                <ButtonBack className='arrow-buttons fa fa-angle-left'></ButtonBack>
                                            </div>
                                            <div className="slider">
                                                <Slider key={index} >
                                                    {collages.map((collage, index) => destination.id === collage.userDestinationId ? <Slide className='slide' key={index} index={index}><ReactPhotoCollage className='collage' {...collage} /> <button onClick={() => toggleDetailsPopUpWindow(collage.userDestinationId, collage.id)} class='details-btn'>Details</button></Slide> : null)}
                                                </Slider>
                                            </div>

                                            <div id='nextbutton' className="control-btn nextbutton">
                                                <ButtonNext className="arrow-buttons fa fa-angle-right"></ButtonNext>
                                            </div>
                                        </div>

                                    </CarouselProvider>

                                    <br />
                                    <br />
                                    <hr />
                                </div>

                            ))}
                        </div>

                        <div label="Favorited">

                            {favoritedDestinations.map((destination, index) => (
                                <div key={index} >

                                    <div className="destination-details">
                                        <h2>{destination.name}</h2>
                                        <img src={destination.image} alt={destination.name} />
                                        <p>{destination.addr}</p>
                                        <button onClick={() => deleteFromList(destination)}>Delete</button>
                                    </div>
                                    <br />
                                    <br />
                                    <hr />
                                </div>

                            ))}
                        </div>

                        {/* uncomment this when I'm ready to work on the share feature
                        <div label="Shared">
                            Nothing to see here, this tab is <em>extinct</em>!
                </div> */}

                    </Tabs>
                </div>

                <Search panTo={panTo} />
                <Locate panTo={panTo} />
                <StyleMap />

                <button className='refresh-btn' onClick={() => window.location.reload(false)}>refresh</button>


                <GoogleMap
                    id='map'
                    mapContainerStyle={mapContainerStyle}
                    zoom={8}
                    center={center}
                    options={options}
                    onLoad={onMapLoad}
                >

                    <TransitMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <SuperMarketMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <ShoppingMallMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <NightClubMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <LodgingMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <HospitalMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <GymMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <CafeMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <AttractionMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    <ResturantMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />

                    {/* UserMarkers are markers created by users whereas the ones above is created by data files */}

                    <UserMarkers destinations={renderDestinations} setSelectedCreatedMarker={setSelectedCreatedMarker} />

                    {selectedDefaultMarker && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedDefaultMarker.geometry.location.lat),
                                lng: parseFloat(selectedDefaultMarker.geometry.location.lng)
                            }}
                            onCloseClick={() => {
                                setSelectedDefaultMarker(null);
                            }}
                        >
                            <div className="info-window">
                                <h2>{selectedDefaultMarker.name}</h2>
                                {/* <img src={`${selectedDefaultMarker.photos['photo_reference']}`} /> */}
                                <DropDown selectedCreatedMarker={selectedCreatedMarker} addToList={addToList} />
                            </div>
                        </InfoWindow>
                    )}

                    {selectedCreatedMarker && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedCreatedMarker.lat + .01), //info box doesn't cover marker with .005 added
                                lng: parseFloat(selectedCreatedMarker.lng)
                            }}
                            onCloseClick={() => {
                                setSelectedCreatedMarker(null);
                            }}
                        >
                            <div className="info-window">
                                <h2>{selectedCreatedMarker.name}</h2>
                                <img src={selectedCreatedMarker.image} alt={selectedCreatedMarker.name} width="400" height="300" />
                                <DropDown selectedCreatedMarker={selectedCreatedMarker} addToList={addToList} />
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}

//===============================================================Global Functions========================================================================
function Locate({ panTo }) {
    return (
        <button
            className="locate"
            onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log(typeof position.coords.latitude)
                        panTo({
                            //  lat: parseFloat(position.coords.latitide),
                            //  lng: parseFloat(position.coords.longitude),
                            lat: parseFloat(31.117809),
                            lng: parseFloat(-97.731133),
                        });
                    },
                    () => null
                );
            }}
        >
            <img src="big_compass.png" alt="compass" width='200' length='200' />
        </button>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 31.117809, lng: () => -97.731133 },
            radius: 200 * 1000,
        },
    });


    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });              //info pertaining to the address the user selected
            const { lat, lng } = await getLatLng(results[0]);           // gives the latitude and longitude of result
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };


    return (
        <div className="search">
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Enter an address"
                />
                <ComboboxPopover>
                    <ComboboxList className='list'>
                        {status === 'OK' &&
                            data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}

