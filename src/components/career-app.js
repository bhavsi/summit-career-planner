//***************************************************
//    career-app.js    Author: Austin George
//    Holds everything inside
//***************************************************

//todo: delete raw id's from state and elsewhere
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
import SandBox from './Sandbox.js';
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
		//CARDS
		cards: {
			'card-0': { id: "card-0", prompt: "Right now, I'm in ...", career: '', field: '', finance: 0, isVisible: true},
			'card-1': { id: "card-1", prompt: "In the future, I'd like to have ...", career: '', field: '', finance: 0, isVisible: false},
		    'card-2': { id: "card-2", prompt: "Test 2", career: '', field: '', finance: 0, isVisible: true},
			'card-3': { id: "card-3", prompt: "Test 3", career: '', field: '', finance: 0, isVisible: false},
		},

		//TIMELINES (Abbreviated as "time-#"" for short)
		timelines: {
			'time-0': {
				id: 'time-0',
				title: 'Timeline 1',
				cardIds: ['card-0','card-1']
			},
			'time-1': {
				id: 'time-1',
				title: 'Timeline 2',
				cardIds: ['card-2','card-3']
			},
		},

		//TIMELINE ORDER
		timelineOrder: ['time-0', 'time-1'],
		lowerBound: 0,
		buttonIsVisible: false,
		openGradDate: false,
		gradDate: 2020,
		onIntro: true,
		showFields: false,
		showCareers: true,
		showNet: false,
    showButtons: false,
		net: 0,
	}

	constructor(props){
		super(props);
		this.onDragEnd = this.onDragEnd.bind(this);
    this.editButton = this.editButton.bind(this);
    this.addButton = this.addButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.locationButton = this.locationButton.bind(this);
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
      let showButtons = prevState.showButtons;

			//***ADD SOURCE TO TARGET***
			if (target % 1 == 0)
			{
				//Transfer Information
				if(type == 'career')
				{
					targets[0].cards[target].career = name;
				}
				else if (type == 'field')
				{
					targets[0].cards[target].field = name;
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
					targets[0].cards[target-.1].career = "";
				}
				else
				{
					targets[0].cards[target-.1].field = "";
				}

				if (type == 'career' && target-.1 == 0)
				{
					lowerBound = 0;
				}
			}

			//***UPDATE VISIBILITIES***

			//Visbility: Check if 1st spot is filled
			console.log("*** " + targets[0].cards[0].career);
			if (targets[0].cards[0].career != "")
			{
				console.log("we is in");
				showFields = true;
				for (var i = 1; i < targets[0].cards.length; i++)
				{
					targets[0].cards[i].isVisible = true;
				}
			}
			else
			{
				showFields = false;
				for (var i = 1; i < targets[0].cards.length; i++)
				{
					targets[0].cards[i].isVisible = false;
				}
			}

			//Visibility: Check if 1st & 2nd spot are occupied
			if (targets[0].cards[0].career != "" && targets[0].cards[1].career != "" && targets[0].cards.length == 2)
			{
				console.log("true");
				buttonIsVisible = true;
			}
			else
			{
				console.log("false");
				buttonIsVisible = false;
			}

			//Upon receiving this info, additional timeline items can be inserted HERE
			return {targets, lowerBound, buttonIsVisible, openGradDate, gradDate, showFields, showCareers, showNet, net, showButtons};
		});

	}

	handleClose = () => {
		this.setState(prevState =>{
			let newState = prevState;
			newState.openGradDate = false;
			return newState;
		})
	}

	//todo: update for nesting
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
        newState.showButtons = true;

  			//***SAMPLE CODE***
  			//For test purposes only.
  			//Ultimately, relevant data/cards will be placed here.
			newState.targets[0].cards[1].finance = 80000;
  			newState.targets[0].cards.splice(1,0,{id: "item-2", prompt: '', career: 'Bachelors', field: 'Engineering', finance: -35000, isVisible: true});
  			newState.targets[0].cards.splice(2,0,{id: "item-3",prompt: '', career: 'Masters', field: 'Computer Science', finance: -21000, isVisible: true});

  			let newNet = 0;
  			for (var i = 0; i < newState.targets[0].cards.length; i++)
  			{
  				newNet += newState.targets[0].cards[i].finance;
  			}

  			newState.net = newNet;

  			return newState;
  		});
  	}

  	//REDO
  	onDragEnd(result) {
  		const { destination, source, draggableId, type } = result;

  		if (!destination) {
  			return;
  		}

  		if (destination.droppableId === source.droppableId && destination.index === source.index){
  			return;
  		}

  		if (type === 'timeline')
  		{
  			const newTimelineOrder = Array.from(this.state.timelineOrder);
  			newTimelineOrder.splice(source.index,1);
  			newTimelineOrder.splice(destination.index,0,draggableId);

  			const newState ={
  				...this.state,
  				timelineOrder: newTimelineOrder,
  			};
  			this.setState(newState);
  			return;
  		}
  		else if (type === 'card')
  		{
	  		const timeline = this.state.timelines[source.droppableId];
	  		const newCardIds = Array.from(timeline.cardIds);
	  		newCardIds.splice(source.index,1);
	  		newCardIds.splice(destination.index, 0, draggableId);

	  		//Adds new 
	  		const newTimeline = {
	  			...timeline,
	  			cardIds: newCardIds,
	  		};

	  		const newState = {
	  			...this.state,
	  			timelines: {
	  				...this.state.timelines,
	  				[newTimeline.id]: newTimeline,
	  			},
	  		};

			this.setState(newState);
		}
  	}

    //Button functions
    editButton() {
      alert('You can drag another field/career step into this box from the left-hand side panel');
    //  <TemporaryDrawer open= true />
    }

    addButton() {

    }

    deleteButton() {
      this.setState(prevState => {
        this.state.targets = '';
        		});
    }

    exploreButton() {
      console.log('Redirecting to another page...')
    }

    locationButton() {

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
    let buttons;

		if (this.state.net < 0)
		{
			netBox = <div><section className="filler"></section><section className="cost"><p>Net Loss: ${this.state.net}</p></section></div>
		}
		else
		{
			netBox = <div className="earnings"><p>Net Gain: ${this.state.net}</p></div>
		}

    if (this.state.buttonIsVisible == false) {
      buttons = <div className="cardButtons">
                     <button className="subcardButtons" onClick = {this.editButton}>EDIT</button>
                     <button className="subcardButtons" onClick = {this.addButton}>ADD</button>
                     <button className="subcardButtons" onClick = {this.deleteButton}>DELETE</button>
                     <button className="subcardButtons" onClick = {this.exploreButton}>EXPLORE</button>
                     <button className="subcardButtons" onClick = {this.locationButton}>LOCATION</button>
                 </div>
    }

    else {
      buttons = <div></div>
    }

		return(
				<div className="careerApp">
        <SandBox/>
        <br></br>
					<TemporaryDrawer handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
                <br></br>
					{this.state.onIntro && <div id="inline">
						<section id="inline">{this.state.showCareers && <CareerPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>}</section>
						<section id="inline">
							{this.state.showFields && <FieldPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
							{!this.state.showFields && <div id="hide"><FieldPanel canDrag={false} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
						</section>
					</div>}

					{/*THE FAKE TIMELINE
					<div id="inline">
					<DragCardsContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="droppable" direction="vertical">
							{(provided, snapshot) => (
								<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
<<<<<<< HEAD
									{this.state.targets.map((item, outerIndex) => (
										<Draggable key={"item-" + outerIndex} draggableId={"item-" + outerIndex} index={outerIndex}>
											{(provided, snapshot) => (
											<div ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} id="inline" className="inlineCard">
											<h1>BOB</h1>
=======
									{this.state.targets.map((item, index) => (
										<Draggable key={item.id} draggableId={item.id} index={index}>

											{(provided, snapshot) => (
											<div ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} id="inline" className="inlineCard">
                           {this.state.showButtons && <div>{buttons}</div>}
											{this.state.targets[index].isVisible && <DraggableTarget canDrag={true}
																									 prompt={this.state.targets[index].prompt}
																									 index={index}
																									 career={this.state.targets[index].career}
																									 field={this.state.targets[index].field}
																									 finance={this.state.targets[index].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>
                                                }

											{!this.state.targets[index].isVisible && <div id="hide"><DraggableTarget canDrag={false}
																									 prompt={this.state.targets[index].prompt}
																								  	 index={index}
																									 career={this.state.targets[index].career}
																									 field={this.state.targets[index].field}
																									 finance={this.state.targets[index].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}

>>>>>>> 47d446aa476203277910e122459f52fc65933d21
											</div>
											)}

										</Draggable>

									))}
									{provided.placeholder}
								</div>

							)}
						</Droppable>

					</DragCardsContext>
					</div>*/}

					{/*BETA BEAUTIFUL TIMELINE*/}
					<div id="inline">
						<DragCardsContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="all-Timelines" type="timeline">
						{(provided, snapshot) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
						{this.state.timelineOrder.map((timeId, index) => {
							const timeline = this.state.timelines[timeId];
							//const cards = timeline.cardIds.map(cardId => this.state.cards[cardId]);
							console.log("TITLE: " + timeline.title);
							//console.log("CARDS: " + cards);
							return (
								<Draggable draggableId={timeline.id} index={index}>
								{(provided, snapshot) => (
								<div {...provided.draggableProps} ref={provided.innerRef}>
									<div {...provided.dragHandleProps} className="timelineTitle"><center><h1>{timeline.title}</h1></center></div>
									<Button>CLONE</Button>
									<Droppable droppableId={timeline.id} direction="horizontal" type="card">
									{(provided, snapshot) => (
									<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
									{timeline.cardIds.map((cardId, index) =>{
										return (
											<Draggable draggableId={cardId} index={index}>
											{(provided, snapshot) => (
											<div {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} ref={provided.innerRef} id="inline" className="inlineCard">
												{this.state.showButtons && <div>{buttons}</div>}
												{this.state.cards[cardId].isVisible && <DraggableTarget canDrag={true}
																									 prompt={this.state.cards[cardId].prompt} 
																									 index={cardId.substring(5)}
																									 career={this.state.cards[cardId].career} 
																									 field={this.state.cards[cardId].field} 
																									 finance={this.state.cards[cardId].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
												{!this.state.cards[cardId].isVisible && <div id="hide"><DraggableTarget canDrag={false}
																									 prompt={this.state.cards[cardId].prompt} 
																								  	 index={cardId.substring(5)}
																									 career={this.state.cards[cardId].career} 
																									 field={this.state.cards[cardId].field} 
																									 finance={this.state.cards[cardId].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
											
											</div>)}
											</Draggable>);
									})}
									</div>)}
									</Droppable>
								</div>)}
								</Draggable>);
						})}
						{provided.placeholder}
						</div>)}
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
		);
	}
}
export default DragDropContext(HTML5Backend)(CareerApp);
