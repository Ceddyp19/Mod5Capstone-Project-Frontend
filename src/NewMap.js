import './App.css';
import './NewMap.css';
import * as resturantsData from './TokyoResturants.json'
import React from 'react';
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


export default function NewMap() {


    const { isLoaded, loadError } = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        googleMapsApiKey: 'AIzaSyCkpZHFHHoT4a991ZAcJ7Z7jUnZXXgaO2Y',
        libraries,
    });

    const [markers, setmarkers] = React.useState([]);
    const [selectedMarker, setSelectedMarker] = React.useState(null);

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
    return (
        <div>
            <h1 id='Logo'>Logo here!!</h1>
            <div id='main'>
                <button className='openbtn' onClick={openNav}>☰ Open Sidebar</button>
            </div>
            <div id='mySidebar'>
                <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>×</a>


                <button className='form-drop-down' onClick={toggleForm}>Add Destination</button>
                <div className='content'>

                    <div className='form-div'>
                        <form>
                            <label className='place-input'>
                                Name of Place:<br />
                                <input type="text" name="name" />
                            </label><br /><br />
                            <label className='image-input'>
                                Url Image:<br />
                                <input type="text" name="name" />
                            </label><br /><br />
                            <label className='location-input'>
                                Location:<br />
                                <PlacesAutocomplete />
                            </label>
                            <input className='submit-btn' type="submit" value="Submit" />

                        </form>
                    </div>
                    {/* <div className='location-search'> */}
                    {/* Location:
                        <PlacesAutocomplete />
                    </div> */}

                </div>
                <Tabs>
                    <div label="All">
                        See ya later, <em>Alligator</em>!
       </div>

                    <div label="Want2Go">
                        After 'while, <em>Crocodile</em>!
       </div>

                    <div label="Visited">
                        Nothing to see here, this tab is <em>extinct</em>!
       </div>

                    <div label="Walk">
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
                            setSelectedMarker(resturant);
                        }}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedMarker.geometry.location.lat),
                            lng: parseFloat(selectedMarker.geometry.location.lng)
                        }}
                        onCloseClick={() => {
                            setSelectedMarker(null);
                        }}
                    >
                        <div>
                            <h2>{selectedMarker.name}</h2>
                            <img src={`${selectedMarker.photos['photo_reference']}`} />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}


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
