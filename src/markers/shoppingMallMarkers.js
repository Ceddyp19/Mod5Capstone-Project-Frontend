import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";
import * as shoppingMallsData from '../location_types/TokyoShoppingMalls.json';


export default class ShoppingMallMarker extends Component {
    state = {}

    render() {
        return (

            <div>
               
               {shoppingMallsData.results.map((shoppingMall) => (
                    <Marker
                        key={shoppingMall['place_id']}
                        position={{ lat: parseFloat(shoppingMall.geometry.location.lat), lng: parseFloat(shoppingMall.geometry.location.lng) }}
                        icon={{
                            url: 'mall64px.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        onClick={() => {
                            this.props.setSelectedDefaultMarker(shoppingMall);
                        }}
                    />
                ))}
            </div>

        );
    }
}