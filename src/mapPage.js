import React, { Component } from 'react';
import MapContainer from './MapContainer';
import { NavLink } from 'react-router-dom';  //difference between NavLink and Link is NavLink has activeClassName style attribute
import './Navbar.css'
import './mapPage.css'
import Tabs from "./Tabs";
import PlacesAutocomplete from './PlacesAutocomplete'

class MapPage extends Component {
    state = {}

    // componentDidMount() {
    //     fetch('https://www.google.com/maps/embed/v1/MODE?key=AIzaSyCkpZHFHHoT4a991ZAcJ7Z7jUnZXXgaO2Y&parameters')
    // }


    handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('submit works');

        // var defaultBounds = new google.maps.LatLngBounds(
        //     new google.maps.LatLng(-33.8902, 151.1759),
        //     new google.maps.LatLng(-33.8474, 151.2631));

        // var input = document.getElementById('searchTextField');
        // var options = {
        //     bounds: defaultBounds,
        //     types: ['establishment']
        // };

        // autocomplete = new google.maps.places.Autocomplete(input, options);

    }

    render() {
        //const Apikey = AIzaSyCkpZHFHHoT4a991ZAcJ7Z7jUnZXXgaO2Y


        return (
            <div>

                <div className="navdiv">
                    <NavLink to='/map' activeClassName='current' exact>Map</NavLink>
                    <NavLink to='/translate' activeClassName='current' exact>Translate</NavLink>
                    <NavLink to='/converse' activeClassName='current' exact>Converse</NavLink>
                </div>
                <PlacesAutocomplete/>
                {/* <Search /> */}
                {/* <form id='searchTextField' onSubmit={this.handleSubmit}>
                    <label>
                        Search: <input type="text" name="name" />
                    </label>
                    <input type="submit" value="Submit" />
                </form> */}


                <div id='map-wrapper'>
                    <MapContainer id='map' />
                    <div id='sidebar'>
                        <p>Sidebar</p>
                        <Tabs>
                            <div label="Bus">
                                See ya later, <em>Alligator</em>!
       </div>

                            <div label="Train">
                                After 'while, <em>Crocodile</em>!
       </div>

                            <div label="Bike">
                                Nothing to see here, this tab is <em>extinct</em>!
       </div>

                            <div label="Walk">
                                Nothing to see here, this tab is <em>extinct</em>!
       </div>


                        </Tabs>
                    </div>
                </div>

            </div>
        );
    }
}


// function Search() {
//     const { ready,
//         value,
//         suggestions: { status, data },
//         setValue,
//         clearSuggestion,
//     } = usePlacesAutocomplete({
//         requestOptions: {
//             location: { lat: () => 43.653225, lng: () => -79.383186 },
//             radius: 200 * 1000,
//         },
//     });

//     return <Combobox
//         onSelect={(address) => {
//             console.log(address)
//         }}
//     >
//         <ComboboxInput value={value} onChange={(e) => {
//             setValue(e.target.value);
//         }}
//             disabled={!ready}
//             placeholder="Enter an Address"
//         />
//         <ComboboxPopover>

//         </ComboboxPopover>
//     </Combobox>
// }


export default MapPage;