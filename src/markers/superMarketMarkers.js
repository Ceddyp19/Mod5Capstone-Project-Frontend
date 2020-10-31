import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as superMarketsData from '../location_types/TokyoSuperMarkets.json';


export default class SuperMarketMarker extends Component {
    state = {}

    render() {
        return (

            <div>
               
               {superMarketsData.results.map((superMarket) => (
                    <Marker
                        key={superMarket['place_id']}
                        position={{ lat: parseFloat(superMarket.geometry.location.lat), lng: parseFloat(superMarket.geometry.location.lng) }}
                        icon={{
                            url: 'superMarket64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            this.props.setSelectedDefaultMarker(superMarket);
                        }}
                    />
                ))}
            </div>

        );
    }
}