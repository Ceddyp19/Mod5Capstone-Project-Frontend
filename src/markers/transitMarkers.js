import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as transitStationsData from '../location_types/TokyoTransitStations.json';

export default class TransitMarker extends Component {
    state = {}

    render() {
        return (

            <div>
                 {transitStationsData.results.map((transitStation) => (
                    <Marker
                        key={transitStation['place_id']}
                        position={{ lat: parseFloat(transitStation.geometry.location.lat), lng: parseFloat(transitStation.geometry.location.lng) }}
                        icon={{
                            url: 'transit64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            this.props.setSelectedDefaultMarker(transitStation);
                        }}
                    />
                ))}
            </div>

        );
    }
}

