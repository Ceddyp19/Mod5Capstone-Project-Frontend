import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as attractionsData from '../location_types/TokyoAttractions.json';


export default class AttractionMarker extends Component {
    state = {}

    render() {
        return (

            <div>
                  {attractionsData.results.map((attraction) => (
                    <Marker
                        key={attraction['place_id']}
                        position={{ lat: parseFloat(attraction.geometry.location.lat), lng: parseFloat(attraction.geometry.location.lng) }}
                        icon={{
                            url: 'attraction64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            this.props.setSelectedDefaultMarker(attraction);
                        }}
                    />
                ))}
            </div>

        );
    }
}
