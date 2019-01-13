//***************************************************
//    career-app.js    Author: Austin George
//    Holds everything inside
//***************************************************

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext as DragCardsContext } from 'react-beautiful-dnd';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import FieldPanel from './field-panel.js';
import CareerPanel from './career-panel.js';
import DraggableTarget from './draggable-target.js';
import TemporaryDrawer from './TemporaryDrawer.js';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemSpecs = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const getListSpecs = isDraggingOver => ({
  display: 'flex',
  overflow: 'auto',
});

class CareerApp extends React.Component {
	state = {
		targets: [
			{ id: "item-0", prompt: "Right now, I'm in ...", career: '', field: '', finance: 0, isVisible: true},
			{ id: "item-1", prompt: "In the future, I'd like to have ...", career: '', field: '', finance: 0, isVisible: false},
		],
		lowerBound: 0,
		buttonIsVisible: false,
		openGradDate: false,
		gradDate: 2020,
		onIntro: true,
		showFields: false,
		showCareers: true,
		showNet: false,
		net: 0,
	}

	constructor(props){
		super(props);
		this.onDragEnd = this.onDragEnd.bind(this);
	};

	//Executed whenever a field/career is selected
	updateTarget = (target, type, name) => {
		this.setState(prevState => {
			let targets = prevState.targets;
			let lowerBound = prevState.lowerBound;
			let buttonIsVisible = prevState.buttonIsVisible;
			let openGradDate = prevState.openGradDate;
			let gradDate = prevState.gradDate;
			let showFields = prevState.showFields;
			let showCareers = prevState.showCareers;
			let showNet = prevState.showNet;
			let net = prevState.net;

			//***ADD SOURCE TO TARGET***
			if (target % 1 == 0)
			{
				//Transfer Information
				if(type == 'career')
				{
					targets[target].career = name;
				}
				else if (type == 'field')
				{
					targets[target].field = name;
				}

				//Prompt Graduation Date
				if(type == 'career' && target == 0 && name != 'Occupation')
				{
					openGradDate = true;
				}
			}

			//***REMOVE SOURCE FROM TARGET***
			else
			{
				if (type == 'career')
				{
					targets[target-.1].career = "";
				}
				else
				{
					targets[target-.1].field = "";
				}

				if (type == 'career' && target-.1 == 0)
				{
					lowerBound = 0;
				}
			}

			//***UPDATE VISIBILITIES***

			//Visbility: Check if 1st spot is filled
			if (targets[0].career != "")
			{
				showFields = true;
				for (var i = 1; i < targets.length; i++)
				{
					targets[i].isVisible = true;
				}
			}
			else
			{
				showFields = false;
				for (var i = 1; i < targets.length; i++)
				{
					targets[i].isVisible = false;
				}
			}

			//Visibility: Check if 1st & 2nd spot are occupied
			if (targets[0].career != "" && targets[1].career != "" && targets.length == 2)
			{
				buttonIsVisible = true;
			}
			else
			{
				buttonIsVisible = false;
			}

			//Upon receiving this info, additional timeline items can be inserted HERE
			return {targets, lowerBound, buttonIsVisible, openGradDate, gradDate, showFields, showCareers, showNet, net};
		});
	}

	handleClose = () => {
		this.setState(prevState =>{
			let newState = prevState;
			newState.openGradDate = false;
			return newState;
		})
	}

	handleChange = name => event => {
    	this.setState({ [name]: Number(event.target.value) });
  	}

  	changeLB = (newLB) => {
  		this.setState(prevState => {
  			let newState = prevState;
  			newState.lowerBound = newLB;
  			return newState;
  		});
  	}

  	buildTimeline = () => {
  		console.log("Building Timeline ...");
  		this.setState(prevState => {
  			let newState = prevState;
			newState.showFields = false;
			newState.showCareers = false;
  			newState.buttonIsVisible = false;
  			newState.showNet = true;
  			newState.onIntro = false;

  			//***SAMPLE CODE***
  			//For test purposes only.
  			//Ultimately, relevant data/cards will be placed here.
			newState.targets[1].finance = 80000;
  			newState.targets.splice(1,0,{id: "item-2", prompt: '', career: 'Bachelors', field: 'Engineering', finance: -35000, isVisible: true});
  			newState.targets.splice(2,0,{id: "item-3",prompt: '', career: 'Masters', field: 'Computer Science', finance: -21000, isVisible: true});

  			let newNet = 0;
  			console.log("***NEW TARGETS LENGTH: " + newState.targets.length);
  			for (var i = 0; i < newState.targets.length; i++)
  			{
  				console.log("***TARGET #" + i + " FINANCE: " + newState.targets[i].finance);
  				newNet += newState.targets[i].finance;
  			}

  			console.log('***NEW NET: ' + newNet);
  			newState.net = newNet;
  			
  			return newState;
  		});
  	}

  	onDragEnd(result) {
  		if (!result.destination)
  		{
  			return;
  		}

  		const newTargets = reorder(
  			this.state.targets,
  			result.source.index,
      		result.destination.index
  		);

  		this.setState(prevState => {
  			let newState = prevState;
  			newState.targets = newTargets;
  		});
  	}

	render(){
		const style = {
		background:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
		textTransform: 'none',
	  	borderRadius: 6,
	 	border: 0,
	  	color: 'white',
	  	height: 250,
	  	width: 250,
	  	padding: '0 30px',
	  	boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
	  	fontFamily: "Helvetica",
	  	fontWeight: 'bold',
	  	fontSize: 16,
	  	letterSpacing: 1,
		};

		let netBox;

		if (this.state.net < 0)
		{
			netBox = <div><section className="filler"></section><section className="cost"><p>Net Loss: ${this.state.net}</p></section></div>
		}
		else
		{
			netBox = <div className="earnings"><p>Net Gain: ${this.state.net}</p></div>
		}

		return(
				<div className="careerApp">
					<TemporaryDrawer handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

					{this.state.onIntro && <div id="inline">
						<section id="inline">{this.state.showCareers && <CareerPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>}</section>
						<section id="inline">
							{this.state.showFields && <FieldPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
							{!this.state.showFields && <div id="hide"><FieldPanel canDrag={false} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
						</section>
					</div>}
					
					{/*THE ACTUAL TIMELINE*/}
					<div id="inline">
					<DragCardsContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="droppable" direction="horizontal">
							{(provided, snapshot) => (
								<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
									{this.state.targets.map((item, index) => (
										<Draggable key={item.id} draggableId={item.id} index={index}>
											{(provided, snapshot) => (
											<div ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} id="inline" className="inlineCard">
											{this.state.targets[index].isVisible && <DraggableTarget canDrag={true}
																									 prompt={this.state.targets[index].prompt} 
																									 index={index}
																									 career={this.state.targets[index].career} 
																									 field={this.state.targets[index].field} 
																									 finance={this.state.targets[index].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
											{!this.state.targets[index].isVisible && <div id="hide"><DraggableTarget canDrag={false}
																									 prompt={this.state.targets[index].prompt} 
																								  	 index={index}
																									 career={this.state.targets[index].career} 
																									 field={this.state.targets[index].field} 
																									 finance={this.state.targets[index].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
											</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragCardsContext>
					</div>
					
					{this.state.onIntro && <div id="inline" className="inlineCard">
						{this.state.buttonIsVisible && <Button onClick={this.buildTimeline} style={style}>How do I get there?</Button>}
						{!this.state.buttonIsVisible && <div id="hide"><Button style={style}>How do I get there?</Button></div>}
						<p id="clear">.</p>
						<div className="zilch"></div>
					</div>}

					{!this.state.onIntro && <div id="inline" className="inlineCard">
						<div className="target" id="whiteBackground">Timeline 1</div>
						<p id="clear">.</p>
						<center>{netBox}</center>
					</div>}

 					<Dialog open={this.state.openGradDate} onClose={this.handleClose}>
 						<DialogTitle>Expected Graduation Date</DialogTitle>
 						<DialogContent>
 							<FormControl>
 								<Select value={this.state.gradDate} onChange={this.handleChange('gradDate')}>
 									<option value=""/>
 									<option value={2018}>2018</option>
 									<option value={2019}>2019</option>
 									<option value={2020}>2020</option>
 									<option value={2021}>2021</option>
 									<option value={2022}>2022</option>
 								</Select>
 							</FormControl>
 						</DialogContent>
 						<DialogActions>
 							<Button onClick={this.handleClose} color="primary">Ok</Button>
 						</DialogActions>
 					</Dialog>
				</div>
		)
	}
}
export default DragDropContext(HTML5Backend)(CareerApp);
