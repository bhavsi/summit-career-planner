//***********************************************
//   field-panel.js   Author: Austin George
//   Holds all field options
//   Structure: Place inside left-hand drawer
//***********************************************

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget } from 'react-dnd';
import DraggableSource from './draggable-source.js';
import BackButton from './back-button.js';
import Search from './search-bar.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const itemTarget = {
	drop(props, monitor, component){
		return {id: -1};
	}
}

function collect(connect, monitor){
	return{
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem(),
	}
}

class FieldPanel extends React.Component {
	state = {
		levelA: -1,
		levelB: -1,
	}

	constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
	this.showFields = this.showFields.bind(this);
  }

	handleChange(name,value) {
		//Evade Categories That Do Not Contain Level C
		if(name == 'levelB' && typeof this.props.options.fields[this.state.levelA].fields[value].fields === "undefined") return;
	    this.setState(prevState => ({
				[name]: value
	    }));
	  }

	showFields() {
		this.setState(prevState => {
			let newState = prevState;
			if(newState.levelB >= 0) newState.levelB = -1;
			else if (newState.levelA >= 0) newState.levelA = -1;
			return newState;
		});
console.log("prsssed");

}

	//Executed whenever a field/career is selected
	handleDrop = (target, type, name) => {
		return this.props.handleDrop(target, type, name);
	}

	render(){
		const { connectDropTarget, hovered, item } = this.props;

		let fields;

		if(isLoaded(this.props.options)){
			//LEVEL A
			if (this.state.levelA < 0 || this.state.showFields) {
			fields = <div className="innerFields">
						{this.props.options.fields.map((item, index) => (
							<div onClick={() => this.handleChange('levelA',index)}><DraggableSource
							origin="panel"
							canDrag={this.props.canDrag}
							key={index}
							type="field"
							index={index}
							item={item}
							handleClick={() => this.setLevel(index)}
							handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/></div>
							))}
					</div>;
			}

			//LEVEL B
			else if (this.state.levelB < 0) {
			fields = <div className="innerFields">
						{this.props.options.fields[this.state.levelA].fields.map((item, index) => (
							<div onClick={() => this.handleChange('levelB',index)}><DraggableSource
							origin="panel"
							canDrag={this.props.canDrag}
							key={index}
							type="field"
							index={index}
							item={item}
							handleClick={() => this.setLevel(index)}
							handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/></div>
							))}
					</div>;

			}

			//LEVEL C
			else {
			fields = <div className="innerFields">
						{this.props.options.fields[this.state.levelA].fields[this.state.levelB].fields.map((item, index) => (
							<DraggableSource
							origin="panel"
							canDrag={this.props.canDrag}
							key={index}
							type="field"
							index={index}
							item={item}
							handleClick={() => this.setLevel(index)}
							handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
							))}
					</div>;
			}
		}

		return connectDropTarget(
			<div className="fieldPanel">
				<h1>Fields</h1>
				<div className="searchBar">
							<Search/>
							</div>
				{fields}
					<button
						className="backButton"
						onClick={this.showFields}>
					BACK
				</button>
			</div>
		)
	}
}

export default DropTarget('item', itemTarget, collect)(compose(
	firebaseConnect(props => [{ path: 'options'}]),
	connect((state, props) => ({
		options: state.firebase.data.options
	}))
	)(FieldPanel))
