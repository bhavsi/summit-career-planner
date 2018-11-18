import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import FieldPanel from '../components/field-panel.js';
import DraggableTarget from '../components/draggable-target.js';
import CareerApp from '../components/career-app.js';

class HomePage extends React.Component{
    render(){
	return(
	    <div>
	    	<CareerApp/>
	    </div>
	)
    }
};

export default HomePage
