//This component is used to make the dropdown element when a user adds a marker to a list
import React, { Component } from "react";
import "./dropDown.css";

class DropDown extends Component {
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
  addMarkerToList = (markerProps, listName) => {                //passes props back parent component(NewMap.js) using callback function (addToList)  
    //console.log(markerProps, listName)
    this.props.addToList(markerProps, listName);
  }

  render() {
    return (
      <div className="App">
        <div className="container" ref={this.container}>
          <button type="button" class="button" onClick={this.handleButtonClick}>
            +
          </button>
          {this.state.open && (
            <div class="container">
              <ul>
                <li onClick={() => this.addMarkerToList(this.props.selectedCreatedMarker, 'Favorite')}>Favorite</li>
                <li onClick={() => this.addMarkerToList(this.props.selectedCreatedMarker, 'Want to Go')}>Want2Go</li>
                <li onClick={() => this.addMarkerToList(this.props.selectedCreatedMarker, 'Visited')}>Visited</li>
                <li>Option 4</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DropDown;