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
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


const itemTarget = {
	drop(props, monitor, component){
		return {id: -2};
	}
}

function collect(connect, monitor){
	return{
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem(),
	}
}

class CareerPanel extends React.Component {
	state = {
	}

	constructor(props){
		super(props);
	};

	//Executed whenever a field/career is selected
	handleDrop = (target, type, name) => {
		//Customization: Eliminate all lower-level career options
		if (target == 0)
		{
			let newLowerBound;
			for (var i = 0; i < this.props.options.careers.length; i++)
			{
				if (this.props.options.careers[i].name == name) newLowerBound = i + 1;
			}
			if (newLowerBound == this.props.options.careers.length) newLowerBound--;

			this.props.changeLB(newLowerBound);
		}

		return this.props.handleDrop(target, type, name);
	}

	render(){
		const { connectDropTarget, hovered, item } = this.props;

		let careers;

		if(isLoaded(this.props.options))
		{
			let careerList = this.props.options.careers.slice(this.props.lowerBound);
			careers = <div className="innerCareers">
						{careerList.map((item, index) => (
							<DraggableSource canDrag={this.props.canDrag} key={index} type="career" index={index+this.state.lowerBound} item={item} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
						))}
					</div>;
		}

		return connectDropTarget(
			<div className="careerPanel">
				<div className="careerTitle"><h1>Career</h1><h1>Step</h1></div>
				<br/>
				{careers}
			</div>
		)
	}
}

export default DropTarget('item', itemTarget, collect)(compose(
	firebaseConnect(props => [{ path: 'options'}]),
	connect((state, props) => ({
		options: state.firebase.data.options
	}))
	)(CareerPanel))
