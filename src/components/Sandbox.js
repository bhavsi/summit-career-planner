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
import DraggableTarget from './draggable-target.js';
import DraggableSource from './draggable-source.js';
import { DragSource, DropTarget } from 'react-dnd';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext as DragCardsContext } from 'react-beautiful-dnd';

const itemTarget = {
	drop(props, monitor, component){
		return {id: props.index};
	}
}

const styles = {
  root: {
      backgroundColor: "transparent",
  },

  list: {
    width: 600,
  },

  paper: {
    backgroundColor: "transparent",
  }
};

class SandBox extends React.Component {

  constructor(){
	super();
}

  state = {
    open: false,
  };


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  onDragEnd(result){
    console.log("An item has been dragged into Sandbox!");
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;


    return (
      <div>
        <button className="pageButtons" onClick={this.handleDrawerOpen}>OPEN SANDBOX</button>
        <Drawer open={open} anchor="right" variant="persistent">
          <div
            tabIndex={0}
            role="button">
            <h1>Sandbox</h1>
              <DragCardsContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="sandbox" type="timeline">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <p>Drag an entire timeline to the sandbox via the timeline's purple tab!</p>
              </div>
              )}
            </Droppable>
            </DragCardsContext>
          </div>
					<Button className="pageButtons" onClick={this.handleDrawerClose}>
						CLOSE
					</Button>
        </Drawer>
      </div>
    );
  }
}

SandBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SandBox);
