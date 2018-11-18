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

class CareerPanel extends React.Component {
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

		let careers;

		if(isLoaded(this.props.options))
		{
			careers = <div className="innerCareers">
						{this.props.options.careers.map((item, index) => (
							<DraggableSource key={index} type="career" index={index} item={item} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

							))}
					</div>;
		}

		return(
				<div className="careerPanel">
					<h1>Careers</h1>
					<br/>
					{careers}
				</div>
			)

	}
}

export default compose(
	firebaseConnect(props => [{ path: 'options'}]),
	connect((state, props) => ({
		options: state.firebase.data.options
	}))
	)(CareerPanel)