//============================================My Imports======================================================
import './App.css';
import './NewMap.css';
import * as resturantsData from './TokyoResturants.json'
import React, { useState } from 'react';
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

import mapStyles from './mapStyles';
import Tabs from "./Tabs";
import PlacesAutocomplete from './PlacesAutocomplete'
import DropDown from './dropDown';

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
const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true
}

//==================================================================My Map Component=========================================================
export default function NewMap() {

    //**************State Hooks***************************/
    const [nameValue, setNameValue] = useState('');  //set the input value of Name of Place as person types
    const [imageUrlValue, setImageUrlValue] = useState('');  //set the input value of image
    const [destinations, setDestinations] = useState([]);  //holds all destinations created by user
    const [favorited, setFavorited] = useState([]);  //holds favorited destinations list
    const [wantToGo, setWantToGo] = useState([]);    //holds Want2Go destinations list
    const [visited, setVisited] = useState([]);      //holds Visited destinations list
    // const [shared, setShared] = useState([]);     //holds Shared destinations list



    //const [markers, setmarkers] = React.useState([]);
    const [selectedDefaultMarker, setselectedDefaultMarker] = React.useState(null);
    const [selectedCreatedMarker, setselectedCreatedMarker] = React.useState(null);
    //***************Variables*************************************/
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

    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    function handleNameInput(event) {
        setNameValue(event.target.value);   //handles user input in form 
    }

    function handleImageInput(event) {
        setImageUrlValue(event.target.value);   //handles user input in form 
    }

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
                setDestinations([...destinations, { name: name, image: image, address: address, lat: lat, lng: lng }])
            })
            .catch((error) => {
                console.log("😱 Error: ", error);
            });

    }

    function addToList(markerProps, listName) {
        //console.log('addToList function operational!', markerProps, listName)

        switch (listName) {
            case "Favorite":
                console.log(markerProps.name + ' added to ' + listName)
                break;
            case "Want to Go":
                console.log(markerProps.name + ' added to ' + listName)
                break;
            case "Visited":
                console.log(markerProps.name + ' added to ' + listName)
                break;
            default:
                console.log('Error, List not found')
        }
    }

    //********************Returned Component Values**************************************/
    return (
        <div>
            <h1 id='Logo'>Logo here!!</h1>
            <div id='main'>
                <button className='openbtn' onClick={openNav}>☰ Open Sidebar</button>
            </div>
            <div id='mySidebar'>
                <a href="#" className="closebtn" onClick={closeNav}>×</a>


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
                        {destinations.map((destination) => (
                            <div>
                                <h2>{destination.name}</h2>
                                <img src={destination.image} width="120" height="80" />
                                <p>{destination.address}</p>
                            </div>

                        ))}
                    </div>

                    <div label="Want2Go">
                        After 'while, <em>Crocodile</em>!
       </div>

                    <div label="Visited">
                        Nothing to see here, this tab is <em>extinct</em>!
       </div>

                    <div label="Favorited">
                        Nothing to see here, this tab is <em>extinct</em>!
       </div>

                    <div label="Shared">
                        Nothing to see here, this tab is <em>extinct</em>!
       </div>

                </Tabs>
            </div>

            <Search panTo={panTo} />
            <Locate panTo={panTo} />

            <GoogleMap
                id='map'
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {resturantsData.results.map((resturant) => (
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
                            setselectedDefaultMarker(resturant);
                        }}
                    />
                ))}

                {destinations.map((destination, index) => (
                    <Marker
                        key={index}
                        position={{ lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) }}
                        onClick={() => {
                            setselectedCreatedMarker(destination);
                        }}
                    />
                ))}

                {selectedDefaultMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedDefaultMarker.geometry.location.lat),
                            lng: parseFloat(selectedDefaultMarker.geometry.location.lng)
                        }}
                        onCloseClick={() => {
                            setselectedDefaultMarker(null);
                        }}
                    >
                        <div>
                            <h2>{selectedDefaultMarker.name}</h2>
                            {/* <img src={`${selectedDefaultMarker.photos['photo_reference']}`} /> */}
                        </div>
                    </InfoWindow>
                )}

                {selectedCreatedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedCreatedMarker.lat),
                            lng: parseFloat(selectedCreatedMarker.lng)
                        }}
                        onCloseClick={() => {
                            setselectedCreatedMarker(null);
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
