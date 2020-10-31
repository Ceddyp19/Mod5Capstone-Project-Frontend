import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as cafesData from '../location_types/TokyoCafes.json';


export default class CafeMarker extends Component {
    state = {}

    render() {
        return (

            <div>
                  {cafesData.results.map((cafe) => (
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
                            this.props.setSelectedDefaultMarker(cafe);
                        }}
                    />
                ))}
            </div>

        );
    }
}
