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

const styles = {
  list: {
    width: 540,
  },
};

class TemporaryDrawer extends React.Component {
  state = {
    left: false,
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
        <FieldPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
          <CareerPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
      </div>
    );

    return (
      <div>
        <Button onClick={this.toggleDrawer('left', true)}>Open Menu</Button>
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);
