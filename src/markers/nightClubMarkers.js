import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as nightClubsData from '../location_types/TokyoNightClubs.json';


export default class NightClubMarker extends Component {
    state = {}

    render() {
        return (

            <div>
               
               {nightClubsData.results.map((nightClub) => (
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
                            this.props.setSelectedDefaultMarker(nightClub);
                        }}
                    />
                ))}
            </div>

        );
    }
}