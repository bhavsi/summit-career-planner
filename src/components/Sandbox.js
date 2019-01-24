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

function collect(connect, monitor){
	return{
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem(),
	}
}

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

  handleDrop = (target, type, name) => {
    return this.props.handleDrop(target, type, name);
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const { connectDropTarget, hovered, item } = this.props;

    let content;

    content = <div>
          <DraggableSource canDrag={this.props.canDrag} targetIndex = {this.props.index} type="career" item={{name: this.props.career}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
          <p>in</p>
          <DraggableSource canDrag={this.props.canDrag} targetIndex = {this.props.index} type="field" item={{name: this.props.field}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
          </div>


    const sideList = (
      <div className={classes.list}>
            <div className="editableTimeline">Empty Timeline Slot</div>
            <div className="editableTimeline">Empty Timeline Slot</div>
            <div className="editableTimeline">Empty Timeline Slot</div>
      </div>
    );

    return (
      <div>
        <button
        className="pageButtons"
        onClick={this.handleDrawerOpen}>OPEN SANDBOX</button>


        <Drawer
        open={open}
        anchor="right"
        variant="persistent">





          <div
            tabIndex={0}
            role="button">
  {sideList}
          </div>
					<Button
					className="pageButtons"
					onClick={this.handleDrawerClose}>
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
