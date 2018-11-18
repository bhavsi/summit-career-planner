//***************************************************
//   draggable-target.js    Author: Austin George
//   Receives a draggable source (field OR career)
//   Structure: Place inside entire timeline app
//***************************************************


import React from 'react';
import { DropTarget } from 'react-dnd';

const itemTarget = {
	drop(props, monitor, component){
		return {id: props.index};
	}
}

function collect(connect, monitor){
	return{
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem(),
	}
}

class DraggableTarget extends React.Component {
	render(){
		const { connectDropTarget, hovered, item } = this.props;
		const backgroundColor = hovered ? 'lightblue' : 'white';
		
		let content;

		

		if (this.props.career === '' && this.props.field === '')
		{
			content = <p>{this.props.prompt}</p>;
		}
		else if (this.props.career === '')
		{
			content = <div id="confirmed">{this.props.field}</div>;
		}
		else
		{
			content = <div id="confirmed">{this.props.career} in {this.props.field}</div>;
		}

		return connectDropTarget(
			<div className = "target" style = {{ background: backgroundColor }}>
				{content}
			</div>
			);
	}
}
export default DropTarget('item', itemTarget, collect)(DraggableTarget);