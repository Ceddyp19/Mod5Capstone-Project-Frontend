//This component is used to make the dropdown element when a user adds a marker to a list
import React, { Component } from "react";
import "./css/mapStyleDropDown.css";

class MapStyleDropDown extends Component {
  container = React.createRef();
  state = {
    open: false,
  };
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside = event => {
    if (this.container.current && !this.container.current.contains(event.target)) {
      this.setState({
        open: false,
      });
    }
  };
  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open,
      };
    });
  };

  render() {
    return (
    
        <div className="container" ref={this.container}>
          <button className='map-icon' type="button" onClick={this.handleButtonClick}>
          <img src="icons8-map-100.png" alt="map" width="50" height="60" />
          </button>
          {this.state.open && (
            <div className="inner-container">
              <ul>
                <li onClick={() => this.props.changeStyle('multiBrandNetwork')}>Multi Brand Network</li>
                <li onClick={() => this.props.changeStyle('bluewater')}>Blue Water</li>
                <li onClick={() => this.props.changeStyle('blueEssence')}>Blue Essence</li>
                <li onClick={() => this.props.changeStyle('mutedBlue')}>Muted Blue</li>
                <li onClick={() => this.props.changeStyle('lunarLandscape')}>Lunar Landscape</li>
                <li onClick={() => this.props.changeStyle('mutedMonotone')}>Muted Monotone</li>
                <li onClick={() => this.props.changeStyle('cobalt')}>Cobalt</li>
                <li onClick={() => this.props.changeStyle('navigation')}>Navigation</li>
                <li onClick={() => this.props.changeStyle('sinCity')}>Sin City</li>
                <li onClick={() => this.props.changeStyle('unsaturatedBrowns')}>Unsaturated Browns</li>
                <li onClick={() => this.props.changeStyle('appleMap')}>Apple Map</li>
              </ul>
            </div>
          )}
        </div>
     
    );
  }
}

export default MapStyleDropDown;