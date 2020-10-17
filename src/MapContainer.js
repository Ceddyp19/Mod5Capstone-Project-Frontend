import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import './mapContainer.css';

class MapContainer extends Component {

    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    fetchPlaces(mapProps, map) {
        const { google } = mapProps;
        const service = new google.maps.places.PlacesService(map);
    };

    // const mapStyle = [
    //     {
    //         featureType: 'landscape.man_made',
    //         elementType: 'geometry.fill',
    //         stylers: [
    //             {
    //                 color: '#dceafa'
    //             }
    //         ]
    //     },
    // ]

    // _mapLoaded(mapProps, map) {
    //     map.setOptions({
    //         styles: mapStyle
    //     })
    // }

    render() {
        const style = {
            width: '60%',
            height: '60%',
            position: "absolute",
            right: '10px',
            top: '100px'
        }



        return (
            <div id='container'>

                {/* <Search></Search> */}

                <Map google={this.props.google}
                    zoom={14}
                    style={style}
                //onReady={this.fetchPlaces}
                >

                    <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />

                    <InfoWindow onClose={this.onInfoWindowClose}
                        onOpen={this.windowHasOpened}
                        onClose={this.windowHasClosed}
                        marker={this.state.activeMarker}     //Places window on marker
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                    </InfoWindow>
                </Map>
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

export default GoogleApiWrapper({
    // apiKey: (process.env.REACT_APP_API_KEY_GOOGLEMAP),
    apiKey: ('AIzaSyCkpZHFHHoT4a991ZAcJ7Z7jUnZXXgaO2Y'),
    libraries: ['places']
})(MapContainer)
