import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as resturantsData from '../location_types/TokyoResturants.json';


export default class ResturantMarker extends Component {
    state = {}

    render() {
        return (

            <div>
               
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
                            this.props.setSelectedDefaultMarker(resturant);
                        }}
                    />
                ))}
            </div>

        );
    }
}