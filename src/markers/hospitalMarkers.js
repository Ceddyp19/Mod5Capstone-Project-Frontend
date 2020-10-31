import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as hospitalsData from '../location_types/TokyoHospitals.json';


export default class HospitalMarker extends Component {
    state = {}

    render() {
        return (

            <div>
                {hospitalsData.results.map((hospital) => (
                    <Marker
                        key={hospital['place_id']}
                        position={{ lat: parseFloat(hospital.geometry.location.lat), lng: parseFloat(hospital.geometry.location.lng) }}
                        icon={{
                            url: 'icons8-hospital-3-64.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            this.props.setSelectedDefaultMarker(hospital);
                        }}
                    />
                ))}
            </div>

        );
    }
}