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
import FieldPanel from './field-panel.js';
import CareerPanel from './career-panel.js';
import DraggableTarget from './draggable-target.js';
import DraggableSource from './draggable-source.js';
import { DragSource } from 'react-dnd';
import Search from './search-bar.js'

const styles = {
  root: {
      backgroundColor: "transparent",
  },

  list: {
    width: 540,
  },

  paper: {
    backgroundColor: "transparent",
  }
};

class TemporaryDrawer extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleDrop = (target, type, name) => {
    return this.props.handleDrop(target, type, name);
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;

  const sideList = (
      <div className={classes.list}>
        <FieldPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
          <CareerPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
      </div>
    );



    return (
      <div>
        <Button onClick={this.handleDrawerOpen}>Open Menu</Button>
        <Drawer
        variant="persistent"
        open={open}
        onClose={this.handleDrawerClose}>
            {sideList}

          <Button onClick={this.handleDrawerClose}>
            CLOSE
          </Button>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);
