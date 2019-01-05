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
	}

	constructor(props){
		super(props);
	};

	//Executed whenever a field/career is selected
	handleDrop = (target, type, name) => {
		return this.props.handleDrop(target, type, name);
	}



	render(){
		const { connectDropTarget, hovered, item } = this.props;

		let fields;


		if(isLoaded(this.props.options))
		{
			fields = <div className="innerFields">
						{this.props.options.fields.map((item, index) => (
							<DraggableSource
							key={index}
							type="field"
							index={index}
							item={item}
							handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

							))}
					</div>;
		}

		return connectDropTarget(
			<div className="fieldPanel">
				<h1>Fields</h1>
							<Search/>
				{fields}
				<BackButton/>
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
