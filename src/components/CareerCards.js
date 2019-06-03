import React from 'react';
import CareerApp from '../components/career-app.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget } from 'react-dnd';
import DraggableSource from './draggable-source.js';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';



const styles = {

};

class CareerCards extends React.Component {
  render() {
    return(
      <div>
      <DraggableSource/>
      </div>
    )
  }

}

export default withStyles(styles)(CareerCards);
