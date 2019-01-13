//**************************************************
//   draggable-source.js   Author: Austin George
//   Act as an individual field/career choice
//   Structure: Place inside field/career panels
//**************************************************

import React from 'react';
import { DragSource } from 'react-dnd';

const itemSource = {
	canDrag(props, monitor){
		return props.canDrag;
	},
	beginDrag(props){
		console.log(props.item.name);
		console.log("Index: " + props.index);
		console.log(props.item);
		return props.item;
	},
	endDrag(props, monitor, component){
	if(!monitor.didDrop()) {
		return;
	}

	return props.handleDrop(monitor.getDropResult().id, props.type, props.item.name);
	}
}

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}
}


class DraggableSource extends React.Component {
	render(){
		const { isDragging, connectDragSource, item } = this.props;
		const opacity = isDragging ? 0 : 1;

		return connectDragSource(
			<div className={this.props.type} style={{ opacity }}>
				<span>{item.name}</span>
			</div>
		)
	}
}
export default DragSource('item', itemSource, collect)(DraggableSource)
