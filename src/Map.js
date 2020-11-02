//============================================My Imports======================================================
import './App.css';
import './Map.css';
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


import * as attractionsData from './location_types/TokyoAttractions.json';
import * as cafesData from './location_types/TokyoCafes.json';
import * as gymsData from './location_types/TokyoGyms.json';
import * as hospitalsData from './location_types/TokyoHospitals.json';
import * as lodgingData from './location_types/TokyoLodging.json';
import * as nightClubsData from './location_types/TokyoNightClubs.json';
import * as resturantsData from './location_types/TokyoResturants.json';
import * as shoppingMallsData from './location_types/TokyoShoppingMalls.json';
import * as superMarketsData from './location_types/TokyoSuperMarkets.json';
import * as transitStationsData from './location_types/TokyoTransitStations.json';

import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    useLoadScript,
    Marker,
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
const currentUserDestinations = []; //too many rerenders when trying to use state, so I saved all filtered destinations into this varible and render this instead
//==================================================================My Map Component=========================================================
export default function Map() {


    useEffect(() => {
        fetchData();

        // fetchDestinations();
        // fetchUserDestinations();
        // setTimeout(() => render(), 5000);

        // function render() {
        //     console.log('hi')
        //     console.log(destinations)
        //     console.log(userDestinations)
        //     userDestinations.forEach((ud) => {
        //         destinations.forEach((d) => {
        //             console.log(d)
        //             if (ud.destination_id === d.id) {
        //                 console.log(d)
        //                 currentUserDestinations.push(d)
        //             }
        //         })
        //     })
        //     setRenderDestinations([...renderDestinations, ...currentUserDestinations])
        // }
    }, []);

    //   const fetchUsers = () => {
    //   fetch('http://localhost:3000/users')

    //     .then(response => response.json())
    //     .then(data => {
    //       console.log('Success:', data);
    //     })
    // };
    // fetchUsers();

    //**************State Hooks***************************/
    const [nameValue, setNameValue] = useState('');  //set the input value of Name of Place as person types
    const [imageUrlValue, setImageUrlValue] = useState('');  //set the input value of image
    const [destinations, setDestinations] = useState([]);  //holds all destinations created by all users of app
    //const [userDestinations, setUserDestinations] = useState([]); //holds destination ids pertaining to a specific user; will be used to filter out the destinations state before rendering
    const [renderDestinations, setRenderDestinations] = useState([]); //holds filtered destinations, userDestinations only has id's, that's why I don't just render UserDestinations; there's no details to render
    const [favorited, setFavorited] = useState([]);  //holds favorited destinations list
    const [wantToGo, setWantToGo] = useState([]);    //holds Want2Go destinations list
    const [visited, setVisited] = useState([]);      //holds Visited destinations list
    // const [shared, setShared] = useState([]);     //holds Shared destinations list
    const [images, setImages] = useState({});  //used for image upload
    const [collages, setCollages] = useState([]); //holds all pictures setting of each collage
    const [currentVisitedDestination, setCurrentVisitedDestination] = useState(null);  // this state is used to keep track of the currently selected visited destination that a collage/Memory Album is being added to



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
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        googleMapsApiKey: 'AIzaSyCkpZHFHHoT4a991ZAcJ7Z7jUnZXXgaO2Y',
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
        document.getElementById("mySidebar").style.width = "38%";
        // document.getElementById("main").style.marginLeft = "250px";
    }

    function closeNav(e) {
        e.preventDefault();
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    function handleNameInput(event) {
        setNameValue(event.target.value);   //handles user input in form 
    }

    function handleImageInput(event) {
        setImageUrlValue(event.target.value);   //handles user input in form 
    }
    let id = 0;
    //when a user adds a created destination to their map, this functions saves that to the Destinations model in the database. The Destinations model represents 
    //all the destinations created by all users, then addUserDestination is called in order to persist destinations unique to a particular user. 
    //The UserDestinations data should then be loaded into the destinations state hook whenever the component is first mounted using the useEffect hook 
    function addDestination(e) {
        e.preventDefault();
        //console.log('it works!', e.target.autocomplete.value)

        let name = e.target.name.value
        let image = e.target.image.value
        let address = e.target.autocomplete.value

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
                }).then(res => console.log(res))

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
            }).then(res => console.log(res))
        }
        setTimeout(() => it(address), 3000)
    }


    function fetchData() {

        let Userdes = null;
        let Des = null;

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

                    console.log(data)
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
                    // console.log(d)
                    if (ud.destination_id === d.id) {
                        d.listCategory = ud.listCategory
                        console.log(d)
                        currentUserDestinations.push(d)
                    }
                })
            })
            setRenderDestinations([...renderDestinations, ...currentUserDestinations])
        }



        fetchDestinations();
        fetchUserDestinations();
        setTimeout(() => renderUserDestinations(), 2000);


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

        setDestinations(newDestinations);
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

        if (destination.listCategory === undefined) {
            //deletes from all lists if not currently 
            const currentDestinations = destinations
            setDestinations(currentDestinations.filter(d => d.name !== destination.name))
        } else {

            const newDestinations = destinations.map((d) => {
                const newDestination = { ...d }
                if (destination.name === d.name) {
                    newDestination.listCategory = undefined
                }
                return newDestination;
            })

            setDestinations(newDestinations);
        }

        // let id = destination.id
        // fetch(`${DESTINATIONS_URL}/{id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Authorization': `JWT ${localStorage.getItem("token")}`,
        //         "Content-Type": "application/json",
        //         "Accept": "application/json"
        //     },

        // })


    }

    function deleteFromAllLists(destination) {
        //removes offscreen from frontend
        // const currentDestinations = destinations
        // setDestinations(currentDestinations.filter(d => d.name !== destination.name))
        //===================================================================================
        //deletes on backend
        //first, had to find User_Destination Instance with the same matching destination id attribute
        //so I'll know I'm deleting the correct user_destination instance from database


        // console.log('destinations', renderDestinations)


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

        // renderDestinations.forEach((ud) => {
        //     console.log('break here')
        //     console.log(ud)
        //     console.log('break')
        //     console.log(destination)
        //     if (ud['destination_id'] === destination.id) {
        //         console.log('this should work theoretically speaking')
        //         id = ud.id
        //     }
        // })
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

    function toggleMemoryPopUpWindow(index) {
        setCurrentVisitedDestination(index)
        const modal = document.querySelector(".modal")
        const closeBtn = document.querySelector(".close")
        modal.style.display = "block";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        })
    }

    // function fileChangedHandler(event){
    //     const file = event.target.files[0]
    //     setSelectedFiles([...selectedFiles, file])
    // }

    // function uploadHandler() {
    //     console.log(selectedFiles)
    // }

    function addMemory(e) {
        e.preventDefault();
        //console.log([images])
        // console.log(images[0])
        let currentImages = images
        let photos = []


        Object.keys(currentImages).map(function (keyName, keyIndex) {
            photos.push({ src: currentImages[keyName] })
        })


        //we set the collage settings and also pass the array of photos to the collage as photos

        let visitedDestinationId = currentVisitedDestination

        const setting = {
            width: '150px',
            height: ['62.5px', '42.5px'],
            layout: [1, 4],
            photos: photos,
            showNumOfRemainingPhotos: true,
            visitedDestinationId: visitedDestinationId
        };
        setCollages([...collages, setting])

        // setImages([]);
    }




    //lists for each category shown in side panel
    const favoritedDestinations = destinations.filter(destination => destination.listCategory === 'Favorite')
    const wantToGoDestinations = destinations.filter(destination => destination.listCategory === 'Want to Go')
    const visitedDestinations = destinations.filter(destination => destination.listCategory === 'Visited')
    //********************Returned Component Values**************************************/
    return (
        <div>


            <div class="modal">
                <div class="modal_content">
                    <span class="close">&times;</span>
                    <h2>Memory</h2>
                    <h3>Images</h3>
                    <MultiImageInput
                        images={images}
                        setImages={setImages}
                        cropConfig={{ crop, ruleOfThirds: true }}
                    />
                    <form onSubmit={addMemory}>
                        <label >
                            Tell Your Story:<br />
                            <textarea name='story' id='story' rows='5' cols='33'></textarea>
                        </label><br /><br />
                        <label >
                            Date:<br />
                            <input type="date" name="date" value={nameValue} onChange={handleNameInput} />
                        </label><br /><br />

                        {/* <label >
                                Tell Your Story:<br />
                                <textarea name='story' id='story' rows='5' cols='33'></textarea>
                            </label>
                            <br/><br/> */}
                        <input type="submit" value="Submit" />

                    </form>
                </div>
            </div>


            <h1 id='Logo'>Logo here!!</h1>
            <div id='main'>
                <button className='openbtn' onClick={openNav}>☰ Open Sidebar</button>
            </div>
            <div id='mySidebar'>
                <a href="" className="closebtn" onClick={closeNav}>×</a>


                <button className='form-drop-down' onClick={toggleForm}>Add Destination</button>
                <div className='content'>

                    <div className='form-div'>
                        <form onSubmit={addDestination}>
                            <label className='place-input'>
                                Name of Place:<br />
                                <input type="text" name="name" placeholder="What's the Name?" value={nameValue} onChange={handleNameInput} />
                            </label><br /><br />
                            <label className='image-input'>
                                Url Image:<br />
                                <input type="text" name="image" placeholder="Paste Image Url" value={imageUrlValue} onChange={handleImageInput} />
                            </label><br /><br />
                            <label className='location-input'>
                                Location:<br />
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
                                    <h2>{destination.name}</h2>
                                    <img src={destination.image} width="120" height="80" />
                                    <p>{destination.addr}</p>
                                    <button onClick={() => deleteFromAllLists(destination)}>Delete</button>
                                </div>

                            ))
                        }
                    </div>

                    <div label="Want2Go">
                        {wantToGoDestinations.map((destination, index) => (
                            <div key={index}>
                                <h2>{destination.name}</h2>
                                <img src={destination.image} width="120" height="80" />
                                <p>{destination.addr}</p>
                                <button onClick={() => deleteFromList(destination)}>Delete</button>
                            </div>

                        ))}
                    </div>







                    {/* 
                    <CarouselProvider
                    naturalSlideWidth={15}
                    naturalSlideHeight={20}
                    orientation="horizontal"
                    totalSlides={this.props.movies.length}
                    visibleSlides={5}
                    step={5}
                    infinite={true}

                >
                    <div className="carousel">

                        <div className="slider">
                            <Slider >
                                {this.props.movies.map((movie, index) => <Slide key={index} index={index}><Link key={index} to={`${this.props.url}/${movie.id}`}><Card addMovie={this.props.addMovie} deleteMovie={this.props.deleteMovie} key={movie.title} movie={movie} /></Link> <div>
                                    {movie.favorited ? (<button class="add-btn fa fa-minus" onClick={() => this.props.deleteMovie(movie, false)}></button>) : (<button class="add-btn fa fa-plus" onClick={() => this.props.addMovie(movie, true)} ></button>)}
                                </div></Slide>)}
                            </Slider>
                        </div>
                        <div className="control-btn backbutton">
                            <ButtonBack className='arrow-buttons fa fa-angle-left'></ButtonBack>
                        </div>
                        <div className="control-btn nextbutton">
                            <ButtonNext className="arrow-buttons fa fa-angle-right"></ButtonNext>
                        </div>
                    </div>
                </CarouselProvider> */}


                    <div label="Visited">
                        {visitedDestinations.map((destination, index) => (
                            <div>
                                <h2>{destination.name}</h2>
                                <img src={destination.image} width="120" height="80" />
                                <p>{destination.addr}</p>
                                <button onClick={() => deleteFromList(destination)}>Delete</button>
                                <button onClick={() => toggleMemoryPopUpWindow(index)}>Add Memory</button>
                                <CarouselProvider
                                    naturalSlideWidth={15}
                                    naturalSlideHeight={20}
                                    orientation="horizontal"
                                    totalSlides={12}
                                    visibleSlides={5}
                                    step={3}
                                    infinite={true}

                                >
                                    <div className='carousel'>
                                        <div className="slider">
                                            <Slider key={index} >
                                                {/* { index === currentVisitedDestination ? 
                                                collages.map((collage, index) => <Slide key={index} index={index}><ReactPhotoCollage {...collage} /></Slide>)
                                                :
                                                null

                                        } */}




                                                {collages.map((collage) => index === collage.visitedDestinationId ? <Slide key={index} index={index}><ReactPhotoCollage {...collage} /></Slide> : null)}





                                                {/* <Slide index={0}>I am the first Slide.</Slide>
                                                <Slide index={1}>I am the second Slide.</Slide>
                                                <Slide index={2}>I am the third Slide.</Slide>
                                                <Slide index={3}>I am the fourth Slide.</Slide>
                                                <Slide index={4}>I am the fifth Slide.</Slide>
                                                <Slide index={5}>I am the sixth Slide.</Slide>
                                                <Slide index={6}>I am the seventh Slide.</Slide>
                                                <Slide index={7}>I am the eighth Slide.</Slide>
                                                <Slide index={8}>I am the ninth Slide.</Slide>
                                                <Slide index={9}>I am the tenth Slide.</Slide>
                                                <Slide index={10}>I am the eleventh Slide.</Slide>
                                                <Slide index={11}>I am the twelth Slide.</Slide> */}
                                                {/* this is where the collages would go. would iterate over the state of currently selected collages */}
                                            </Slider>
                                        </div>
                                        <div className="control-btn backbutton">
                                            <ButtonBack className='arrow-buttons fa fa-angle-left'>Back</ButtonBack>
                                        </div>
                                        <div className="control-btn nextbutton">
                                            <ButtonNext className="arrow-buttons fa fa-angle-right">Next</ButtonNext>
                                        </div>
                                        {/* <h2>{destination.name}</h2>
                                        <img src={destination.image} width="120" height="80" />
                                        <p>{destination.address}</p>
                                        <button onClick={() => deleteFromList(destination)}>Delete</button>
                                        <button onClick={closeMemoryPopUpWindow}>Add Memory</button> */}
                                    </div>
                                </CarouselProvider>
                            </div>

                        ))}
                    </div>

                    <div label="Favorited">

                        {favoritedDestinations.map((destination, index) => (
                            <div key={index} >
                                <h2>{destination.name}</h2>
                                <img src={destination.image} width="120" height="80" />
                                <p>{destination.addr}</p>
                                <button onClick={() => deleteFromList(destination)}>Delete</button>
                            </div>

                        ))}
                    </div>

                    <div label="Shared">
                        Nothing to see here, this tab is <em>extinct</em>!
       </div>

                </Tabs>
            </div>

            <Search panTo={panTo} />
            <Locate panTo={panTo} />
            <StyleMap />

            <GoogleMap
                id='map'
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >

                <TransitMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {transitStationsData.results.map((transitStation) => (
                    <Marker
                        key={transitStation['place_id']}
                        position={{ lat: parseFloat(transitStation.geometry.location.lat), lng: parseFloat(transitStation.geometry.location.lng) }}
                        // icon={{
                        //     url: 'transit64.png',
                        //     scaledSize: new window.google.maps.Size(30, 30),
                        //     origin: new window.google.maps.Point(0, 0),
                        //     anchor: new window.google.maps.Point(15, 15),
                        // }}
                        onClick={() => {
                            setSelectedDefaultMarker(transitStation);
                        }}
                    />
                ))} */}
                <SuperMarketMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {superMarketsData.results.map((superMarket) => (
                    <Marker
                        key={superMarket['place_id']}
                        position={{ lat: parseFloat(superMarket.geometry.location.lat), lng: parseFloat(superMarket.geometry.location.lng) }}
                        icon={{
                            url: 'superMarketpx.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(superMarket);
                        }}
                    />
                ))} */}
                <ShoppingMallMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {shoppingMallsData.results.map((shoppingMall) => (
                    <Marker
                        key={shoppingMall['place_id']}
                        position={{ lat: parseFloat(shoppingMall.geometry.location.lat), lng: parseFloat(shoppingMall.geometry.location.lng) }}
                        icon={{
                            url: 'mall64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(shoppingMall);
                        }}
                    />
                ))} */}
                <NightClubMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {nightClubsData.results.map((nightClub) => (
                    <Marker
                        key={nightClub['place_id']}
                        position={{ lat: parseFloat(nightClub.geometry.location.lat), lng: parseFloat(nightClub.geometry.location.lng) }}
                        icon={{
                            url: 'nightclub64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(nightClub);
                        }}
                    />
                ))} */}
                <LodgingMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {lodgingData.results.map((lodge) => (
                    <Marker
                        key={lodge['place_id']}
                        position={{ lat: parseFloat(lodge.geometry.location.lat), lng: parseFloat(lodge.geometry.location.lng) }}
                        icon={{
                            url: 'lodging64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(lodge);
                        }}
                    />
                ))} */}
                <HospitalMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {hospitalsData.results.map((hospital) => (
                    <Marker
                        key={hospital['place_id']}
                        position={{ lat: parseFloat(hospital.geometry.location.lat), lng: parseFloat(hospital.geometry.location.lng) }}
                        icon={{
                            url: 'icons8-hospital-3-64.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(hospital);
                        }}
                    />
                ))} */}
                <GymMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {gymsData.results.map((gym) => (
                    <Marker
                        key={gym['place_id']}
                        position={{ lat: parseFloat(gym.geometry.location.lat), lng: parseFloat(gym.geometry.location.lng) }}
                        icon={{
                            url: 'gym64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(gym);
                        }}
                    />
                ))} */}

                <CafeMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {cafesData.results.map((cafe) => (
                    <Marker
                        key={cafe['place_id']}
                        position={{ lat: parseFloat(cafe.geometry.location.lat), lng: parseFloat(cafe.geometry.location.lng) }}
                        icon={{
                            url: 'cafe64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(cafe);
                        }}
                    />
                ))} */}

                <AttractionMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {attractionsData.results.map((attraction) => (
                    <Marker
                        key={attraction['place_id']}
                        position={{ lat: parseFloat(attraction.geometry.location.lat), lng: parseFloat(attraction.geometry.location.lng) }}
                        icon={{
                            url: 'attraction64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(attraction);
                        }}
                    />
                ))} */}
                <ResturantMarkers setSelectedDefaultMarker={setSelectedDefaultMarker} />
                {/* {resturantsData.results.map((resturant) => (
                    <Marker
                        key={resturant['place_id']}
                        position={{ lat: parseFloat(resturant.geometry.location.lat), lng: parseFloat(resturant.geometry.location.lng) }}
                        icon={{
                            url: 'restaurant48px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            setSelectedDefaultMarker(resturant);
                        }}
                    />
                ))} */}

                {/* destinations are markers created by users whereas the ones above is created by data files */}

                <UserMarkers destinations={renderDestinations} setSelectedCreatedMarker={setSelectedCreatedMarker} />
                {/* {destinations.map((destination, index) => (
                    <Marker
                        key={index}
                        position={{ lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) }}
                        onClick={() => {
                            setSelectedCreatedMarker(destination);
                        }}
                    />
                ))} */}


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
                        <div>
                            <h2>{selectedDefaultMarker.name}</h2>
                            {/* <img src={`${selectedDefaultMarker.photos['photo_reference']}`} /> */}
                            <DropDown selectedCreatedMarker={selectedCreatedMarker} addToList={addToList} />
                        </div>
                    </InfoWindow>
                )}

                {selectedCreatedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedCreatedMarker.lat + .005), //info box doesn't cover marker with .005 added
                            lng: parseFloat(selectedCreatedMarker.lng)
                        }}
                        onCloseClick={() => {
                            setSelectedCreatedMarker(null);
                        }}
                    >
                        <div>
                            <h2>{selectedCreatedMarker.name}</h2>
                            <img src={selectedCreatedMarker.image} width="400" height="300" />
                            <DropDown selectedCreatedMarker={selectedCreatedMarker} addToList={addToList} />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
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
            <img src="compass1.png" alt="compass" />
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
                    <ComboboxList>
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

