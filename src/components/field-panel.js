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
		level: -1,
		isToggleOn: false,
		showFields: false,
	}

	constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
		this.showFields = this.showFields.bind(this);
  }


	handleClick() {
	    this.setState(prevState => ({
				level: 4,
				isToggleOn: !prevState.isToggleOn,
				showFields: !prevState.showFields,
	    }));
	  }

	showFields() {
		this.setState(prevState => ({
				showFields: !prevState.showFields,
		}));
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
			if (this.state.level < 0 || this.state.showFields) {
			fields = <div className="innerFields"
			onClick={this.handleClick}>
						{this.props.options.fields.map((item, index) => (
							<DraggableSource
							canDrag={this.props.canDrag}
							key={index}
							type="field"
							index={index}
							item={item}
							handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
							))}
					</div>;
		}
else {
			fields =  <div className="innerFields"
			onClick={this.handleClick}>
					{this.props.options.fields[this.state.level].sublevels.map((item, index) => (
				<DraggableSource
				canDrag={this.props.canDrag}
				key={index}
				type="field"
				index={index}
				item={item}
				handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
				))}
						</div>;

	}

if (this.state.showFields){
		fields = <div className="innerFields"
		onClick={this.handleClick}>
					{this.props.options.fields.map((item, index) => (
						<DraggableSource
						canDrag={this.props.canDrag}
						key={index}
						type="field"
						index={index}
						item={item}
						handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
						))}
				</div>;
	}
}

		return connectDropTarget(
			<div className="fieldPanel">
				<h1>Fields</h1>
							<Search/>
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