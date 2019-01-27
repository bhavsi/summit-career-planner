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
//just go back to original fields panel
class BackButton extends Component {
  constructor(props) {
    super(props);
  }

handleClick() {
  console.log("working");
}

  render() {
    return (
      <button
      className="backButton"
      onClick={this.handleClick}>
        BACK
      </button>
    );
  }
}


export default BackButton
