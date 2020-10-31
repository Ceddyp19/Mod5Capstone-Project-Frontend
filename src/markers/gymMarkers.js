import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as gymsData from '../location_types/TokyoGyms.json';


export default class GymMarker extends Component {
    state = {}

    render() {
        return (

            <div>
                   {gymsData.results.map((gym) => (
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
                            this.props.setSelectedDefaultMarker(gym);
                        }}
                    />
                ))}
            </div>

        );
    }
}