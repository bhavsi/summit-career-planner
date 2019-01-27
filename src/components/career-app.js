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
		},

		//TIMELINES (Abbreviated as "time-#"" for short)
		timelines: {
			'time-0': {
				id: 'time-0',
				title: 'Timeline 1',
				net: 0,
				cardIds: ['card-0','card-1']
			},
		},

		//TIMELINE ORDER
		timelineOrder: ['time-0',],
		lowerBound: 0,
		buttonIsVisible: false,
		openGradDate: false,
		gradDate: 2020,
		onIntro: true,
		showFields: false,
		showCareers: true,
		showNet: false,
	    showButtons: false,
	    showTimelineTitle: false,
	}

	constructor(props){
		super(props);
		this.onDragEnd = this.onDragEnd.bind(this);
	    this.editButton = this.editButton.bind(this);
	    this.addButton = this.addButton.bind(this);
	    this.deleteButton = this.deleteButton.bind(this);
	    this.locationButton = this.locationButton.bind(this);
	    this.buildTimeline = this.buildTimeline.bind(this);
	    this.cloneTimeline = this.cloneTimeline.bind(this);
	};

	//Finds Timeline based on given card
	findTimeline = (cardId) => {
		for (var timeline in this.state.timelines)
		{
			let timelineObj = this.state.timelines[timeline];
			for (var i = 0; i < timelineObj.cardIds.length; i++)
			{
				if (timelineObj.cardIds[i] === cardId) return timelineObj.id;
			}
		}
		console.log("Error: Card Not Found");
	}
	//Executed whenever a field/career is dragged & dropped
	updateTarget = (target, type, name) => {
		this.setState(prevState => {
			let newState = prevState;
			let cardId = 'card-' + (target);
			let timeId = this.findTimeline(cardId); //Heavy Command
			let firstCardId = newState.timelines[timeId].cardIds[0];
			let secondCardId = newState.timelines[timeId].cardIds[1];
			let visibility;

			//ADD SOURCE TO TARGET
			if (target % 1 == 0)
			{
				let cardId = 'card-' + target;
				newState.cards[cardId][type] = name;

				//Prompt Graduation Date
				if(type == 'career' && firstCardId == cardId && name != 'Occupation') newState.openGradDate = true;
			}
			//REMOVE SOURCE FROM TARGET
			else
			{
				let cardId = 'card-' + (target-.1);
				newState.cards[cardId][type] = "";

				if (type == 'career' && target-.1 == 0) newState.lowerBound = 0;
			}
			
			//VISIBILITY: Check if 1st spot is filled
			if (newState.cards[firstCardId].career != "") visibility = true;
			else visibility = false;

			newState.showFields = visibility;
			for (var i = 1; i < newState.timelines[timeId].cardIds.length; i++)
			{
				let currCardId = newState.timelines[timeId].cardIds[i];
				newState.cards[currCardId].isVisible = visibility;
			}

			//VISIBILITY: Check if 1st & 2nd spot are occupied
			if (newState.cards[firstCardId].career != "" &&
				newState.cards[secondCardId].career != "" &&
				newState.timelines[timeId].cardIds.length == 2)
			{
				newState.buttonIsVisible = true;
			}
			else
			{
				newState.buttonIsVisible = false;
			}


			return newState;
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
  		this.setState(prevState => {
  			let newState = prevState;
  			let cardsSize = Object.keys(this.state.cards).length;
  			newState.showFields = false;
			newState.showCareers = false;
  			newState.buttonIsVisible = false;
  			newState.showNet = true;
  			newState.onIntro = false;
       		newState.showButtons = true;
       		newState.showTimelineTitle = true;

       		//***TEMPORARY SAMPLE CODE***
  			//For test purposes only.
  			//Ultimately, relevant data/cards will be placed here.
  			newState.cards['card-1'].finance = 80000;
  			newState.cards['card-' + cardsSize] = { id: "card-" + cardsSize, prompt: "", career: 'Bachelors', field: 'Engineering', finance: -35000, isVisible: true};
  			newState.cards['card-' + (cardsSize + 1)] = { id: "card-" + (cardsSize + 1), prompt: "", career: 'Masters', field: 'Computer Science', finance: -21000, isVisible: true};
  			newState.timelines['time-0'].cardIds.push('card-' + cardsSize);
  			newState.timelines['time-0'].cardIds.push('card-' + (cardsSize + 1));

  			for (var i = 0; i < newState.timelines['time-0'].cardIds.length; i++)
  			{
  				let currCardId = newState.timelines['time-0'].cardIds[i];
  				newState.timelines['time-0'].net += newState.cards[currCardId].finance;
  			}
  			
  			return newState;
  		});
  	}

  	cloneTimeline = (timeId) => {
  		this.setState(prevState => {
  			let newState = prevState;
  			let timelinesLength = Object.keys(this.state.timelines).length;
  			let cardsLength = Object.keys(this.state.cards).length;

  			//Create new timeX
  			newState.timelines['time-' + timelinesLength] = {
				id: 'time-' + timelinesLength,
				title: 'Timeline ' + (timelinesLength + 1),
				net: 0,
				cardIds: [],
			}

  			for (var i = 0; i < newState.timelines[timeId].cardIds.length; i++)
  			{
  				let currCardId = newState.timelines[timeId].cardIds[i];
  				let currCard = newState.cards[currCardId];
  				let newCardId = 'card-' + (cardsLength + i);
  				newState.cards[newCardId] = { id: newCardId, prompt: "", career: currCard.career, field: currCard.field, finance: currCard.finance, isVisible: true};
  				newState.timelines['time-' + timelinesLength].cardIds.push(newCardId);
  			}

  			newState.timelineOrder.push('time-' + timelinesLength);
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

		if (this.state.timelines['time-0'].net < 0)
		{
			netBox = <div><section className="filler"></section><section className="cost"><p>Net Loss: ${this.state.timelines['time-0'].net}</p></section></div>
		}
		else
		{
			netBox = <div className="earnings"><p>Net Gain: ${this.state.timelines['time-0'].net}</p></div>
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

					{/*ALL TIMELINES*/}
					<div id="inline">
						<DragCardsContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="all-Timelines" type="timeline">
						{(provided, snapshot) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
						{this.state.timelineOrder.map((timeId, index) => {
							const timeline = this.state.timelines[timeId];
							{/*TIMELINE*/}
							return (
								<Draggable draggableId={timeline.id} index={index}>
								{(provided, snapshot) => (
								<div {...provided.draggableProps} ref={provided.innerRef}>
									{this.state.showTimelineTitle && <div {...provided.dragHandleProps} className="timelineTitle"><center><h1>{timeline.title}</h1></center></div>}
									{this.state.showTimelineTitle && <button className="subcardButtons" onClick = {(timeId) => this.cloneTimeline(timeline.id)}>CLONE</button>}
									<div id="inline">
									<div id="inline">
									<Droppable droppableId={timeline.id} direction="horizontal" type="card">
									{(provided, snapshot) => (
									<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
									{timeline.cardIds.map((cardId, index) =>{
										{/*CARD*/}
										return (
											<Draggable draggableId={cardId} index={index}>
											{(provided, snapshot) => (
											<div {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} ref={provided.innerRef} id="inline" className="inlineCard">
												{this.state.showButtons && <div>{buttons}</div>}
												{this.state.cards[cardId].isVisible && <DraggableTarget canDrag={true}
																									 prompt={this.state.cards[cardId].prompt} 
																									 id={cardId.substring(5)}
																									 career={this.state.cards[cardId].career} 
																									 field={this.state.cards[cardId].field} 
																									 finance={this.state.cards[cardId].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
												{!this.state.cards[cardId].isVisible && <div id="hide"><DraggableTarget canDrag={false}
																									 prompt={this.state.cards[cardId].prompt} 
																								  	 id={cardId.substring(5)}
																									 career={this.state.cards[cardId].career} 
																									 field={this.state.cards[cardId].field} 
																									 finance={this.state.cards[cardId].finance}
																									 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}		
											</div>)}
											</Draggable>);
									})}
									</div>)}
									</Droppable>
									</div>
									{this.state.onIntro && <div id="inline" className="inlineCard">
										{this.state.buttonIsVisible && <Button onClick={() => this.buildTimeline()} style={style}>How do I get there?</Button>}
										{!this.state.buttonIsVisible && <div id="hide"><Button style={style}>How do I get there?</Button></div>}
										<p id="clear">.</p>
										<div className="zilch"></div>
									</div>}

									{!this.state.onIntro && <div id="inline" className="inlineCard">
										<div className="filler"/>
										<div className="target" id="whiteBackground">Timeline Info</div>
										<p id="clear">.</p>
										<center>{netBox}</center>
									</div>}
									</div>
								</div>)}
								</Draggable>);
						})}
						{provided.placeholder}
						</div>)}
						</Droppable>
						</DragCardsContext>
					</div>

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
