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
		lowerBound: 0,
	}

	constructor(props){
		super(props);

	};

	//Executed whenever a field/career is selected
	handleDrop = (target, type, name) => {
		//Customization: Eliminate all lower-level career options
		this.setState(prevState =>{
			let newState = prevState;
			let newLowerBound;
			for (var i = 0; i < this.props.options.careers.length; i++)
			{
				if (this.props.options.careers[i].name == name) newLowerBound = i;
			}
			if (newLowerBound == this.props.options.careers.length - 1) newLowerBound--;
			newState.lowerBound = newLowerBound + 1;
			return newState;
		})

		return this.props.handleDrop(target, type, name);
	}

	render(){
		
		let careers;

		if(isLoaded(this.props.options))
		{
			let careerList = this.props.options.careers.slice(this.state.lowerBound);
			careers = <div className="innerCareers">
						{careerList.map((item, index) => (
							<DraggableSource key={index} type="career" index={index+this.state.lowerBound} item={item} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
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