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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


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
    open: true,
  };

  timelineInfo = (timeId) => {
      let content;
      let timeline = this.props.state.timelines[timeId];
      let firstCard = this.props.state.cards[timeline.cardIds[0]];
      let lastCard = this.props.state.cards[timeline.cardIds[timeline.cardIds.length -1]];
      let origin;
      let destination;

      if (firstCard.field == "") origin = <p><b>{firstCard.career}</b></p>
      else origin =<p><b>{firstCard.career} in {firstCard.field}</b></p>
      if (lastCard.field == "") destination = <p><b>{lastCard.career}</b></p>
      else destination =<p><b>{lastCard.career} in {lastCard.field}</b></p>

      content = <div className="timelineInfo">
            <center>
            <h1>{timeline.title}</h1>
            {origin}
            <p>to</p>
            {destination}
            </center>
            </div>

      return(<div>{content}</div>);
    }


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;


    return (
      <div>
        <Drawer open={open} anchor="right" variant="persistent">
          <div
            tabIndex={0}
            role="button">
            <div className="sandboxBoundary">
                <div className="sandboxTitle">
                <center>
                  <h1>Sandbox</h1>
                  <p>Drag a timeline via its purple label!</p>
                </center>
                </div>
                <Droppable droppableId="zone-1" type="timeline">
                {(provided, snapshot) => (
                <div className ="temporarySandbox" {...provided.droppableProps} ref={provided.innerRef}>
                {this.props.state.zones['zone-1'].timeIds.map((timeId, index) => {
                  const timeline = this.props.state.timelines[timeId];
                  {/*TIMELINE ICON*/}
                  return (
                    <div>
                    <Draggable draggableId={timeline.id} index={index}>
                    {(provided, snapshot) => (

                    <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                      <div className="target" id="whiteBackground">{this.timelineInfo(timeline.id)}</div>
                    </div>)}
                    </Draggable>
                    </div>);
                })}
                </div>
                )}
                </Droppable>
              </div>
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
