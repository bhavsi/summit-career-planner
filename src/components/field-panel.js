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
import DraggableSource from './draggable-source.js';

class FieldPanel extends React.Component {
	state = {
	}

	constructor(props){
		super(props);

	};

	//Executed whenever a field/career is selected
	handleDrop = (target, type, name) => {
		console.log('target: ' + target);
		console.log('type: ' + type);
		console.log('name: ' + name);
		return this.props.handleDrop(target, type, name);
	}

	render(){

		let fields;

		if(isLoaded(this.props.options))
		{
			fields = <div className="innerFields">
						{this.props.options.fields.map((item, index) => (
							<DraggableSource key={index} type="field" index={index} item={item} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

							))}
					</div>;
		}

		return(
			<div className="fieldPanel">
				<h1>Fields</h1>
				<br/>
				{fields}
			</div>
		)

	}
}

export default compose(
	firebaseConnect(props => [{ path: 'options'}]),
	connect((state, props) => ({
		options: state.firebase.data.options
	}))
	)(FieldPanel)
