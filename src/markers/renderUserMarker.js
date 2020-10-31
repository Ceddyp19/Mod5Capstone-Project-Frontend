import React, { Component } from 'react';
import { Marker } from "@react-google-maps/api";


class RenderUserMarker extends Component {
    state = {}

    render() {
        let destinations = this.props.destinations
    
        return (

            <div>
                {destinations.map((destination, index) => (
                    <Marker
                        key={index}
                        position={{ lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) }}
                        onClick={() => {
                            this.props.setSelectedCreatedMarker(destination);
                        }}
                    />
                ))}
            </div>

        );
    }
}

export default RenderUserMarker;