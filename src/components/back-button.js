//***************************************************
//    back-button.js    Author: Sira Nassoko
//    A back button for the fields component
//***************************************************

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withStyles } from '@material-ui/core/styles';

class BackButton extends Component {
  constructor(props) {
    super(props);
    //this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    //this.handleClick = this.handleClick.bind(this);
  }

  /*handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }*/

goBack() {
  window.history.back();
  console.log("working");
}

  render() {
    return (
      <button
      className="backButton"
      onClick={this.goBack()}>
        BACK
      </button>
    );
  }
}


export default BackButton
