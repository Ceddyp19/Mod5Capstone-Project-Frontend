import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as lodgingData from '../location_types/TokyoLodging.json';


export default class LodgingMarker extends Component {
    state = {}

    render() {
        return (

            <div>
               
               {lodgingData.results.map((lodge) => (
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
                            this.props.setSelectedDefaultMarker(lodge);
                        }}
                    />
                ))}
            </div>

        );
    }
}