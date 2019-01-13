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

class SandBox extends React.Component {
  state = {
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleDrop = (target, type, name) => {
    return this.props.handleDrop(target, type, name);
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
            <div className="editableTimeline">Timeline 1</div>
            <div className="editableTimeline">Timeline 2</div>
            <div className="editableTimeline">Timeline 3</div>
      </div>
    );

    return (
      <div>
        <Button
        className="sandBoxButton"
        onClick={this.toggleDrawer('right', true)}>Open Sandbox</Button>
        <Drawer
        anchor="right"
        open={this.state.right}
        onClose={this.toggleDrawer('right', false)}>
          <div
            tabIndex={0}
            role="button">
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

SandBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SandBox);
