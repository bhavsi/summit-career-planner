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
import SandBox from './Sandbox.js';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import OptionStack from './option-stack.js';

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
			'card-1': { id: "card-1", prompt: "In the future, I'd like to be in ...", career: '', field: '', finance: 0, isVisible: false},
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

		zones: {
			//MAIN ZONE
			'zone-0': {
				id: 'zone-0',
				title: 'Main Zone',
				timeIds: ['time-0',],
			},
			//SANBOX ZONE
			'zone-1': {
				id: 'zone-1',
				title: 'Sandbox Zone',
				timeIds: [],
			}
		},

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
	    this.buildTimeline = this.buildTimeline.bind(this);
	    this.cloneTimeline = this.cloneTimeline.bind(this);
	    this.deleteTimeline = this.deleteTimeline.bind(this);
	    this.chooseOption = this.chooseOption.bind(this);
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

  	promptTimeline = () => {
  		//Now go back and deal with everything else ...
  		this.setState(prevState => {
  			let newState = prevState;
  			let timelinesLength = Object.keys(this.state.timelines).length;
  			let cardsLength = Object.keys(this.state.cards).length;

  			let cardA = 'card-' + (cardsLength + 1);
  			let cardB = 'card-' + (cardsLength + 2);
  			newState.cards[cardA] = { id: cardA, prompt: "Right now, I'm in ...", career: '', field: '', finance: 0, isVisible: true},
  			newState.cards[cardB] = { id: cardB, prompt: "In the future, I'd like to be in ...", career: '', field: '', finance: 0, isVisible: false},

  			//Create new timeX
  			newState.timelines['time-' + timelinesLength] = {
				id: 'time-' + timelinesLength,
				title: 'Timeline ' + (timelinesLength + 1),
				net: 0,
				cardIds: [cardA, cardB],
			}

  			newState.zones['zone-0'].timeIds.push('time-' + timelinesLength);
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
  			newState.timelines['time-0'].cardIds.splice(1,0,'card-' + cardsSize);
  			newState.timelines['time-0'].cardIds.splice(2,0,'card-' + (cardsSize + 1));

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

  			newState.zones['zone-0'].timeIds.push('time-' + timelinesLength);
  			return newState;
  		});
  	}

  	deleteTimeline = (timeId) => {
  		this.setState(prevState => {
  			let newState = prevState;
  			delete newState.timelines[timeId];
  			for (var i = 0; i < newState.zones['zone-0'].timeIds.length; i++)
  			{
  				if (newState.zones['zone-0'].timeIds[i] == timeId) newState.zones['zone-0'].timeIds.splice(i,1);
  			}
  			return newState;
  		});
  	}

  	timelineInfo = (timeId) => {
  		let content;
  		let timeline = this.state.timelines[timeId];
  		let firstCard = this.state.cards[timeline.cardIds[0]];
  		let lastCard = this.state.cards[timeline.cardIds[timeline.cardIds.length -1]];
  		let origin;
  		let destination;

  		if (firstCard.field == "") origin = <p><b>{firstCard.career}</b></p>
  		else origin =<p><b>{firstCard.career} in {firstCard.field}</b></p>
  		if (lastCard.field == "") destination = <p><b>{lastCard.career}</b></p>
  		else destination =<p><b>{lastCard.career} in {lastCard.field}</b></p>

  		content = <div className="timelineInfo">
  					<center>
  					<h1>{timeline.title}</h1>
  					{origin}
  					<p>to</p>
  					{destination}
  					</center>
   					</div>

  		return(<div>{content}</div>);
  	}

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
  			const start = this.state.zones[source.droppableId];
  			const finish = this.state.zones[destination.droppableId];

  			//REORDERING WITHIN A ZONE
  			if (start === finish)
  			{
  				const zone = this.state.zones[source.droppableId];
	  			const newTimeIds = Array.from(zone.timeIds);
	  			newTimeIds.splice(source.index,1);
	  			newTimeIds.splice(destination.index,0,draggableId);

	  			//Adds new
	  			const newZone = {
	  				...zone,
	  				timeIds: newTimeIds,
	  			};

	  			const newState = {
	  				...this.state,
	  				zones: {
	  					...this.state.zones,
	  					[newZone.id]: newZone,
	  				},
	  			};

	  			this.setState(newState);
	  			return;
  			}
  			//REORDERING BETWEEN ZONES
  			else
  			{
  				//Adjusts Starting Zone
  				const startTimeIds = Array.from(start.timeIds);
  				startTimeIds.splice(source.index,1);
  				const newStart = {
  					...start,
  					timeIds: startTimeIds,
  				};

  				//Adjusts Finishing Zone
  				const finishTimeIds = Array.from(finish.timeIds);
  				finishTimeIds.splice(destination.index,0,draggableId);
  				const newFinish = {
  					...finish,
  					timeIds: finishTimeIds,
  				};

  				const newState = {
  					...this.state,
  					zones: {
  						...this.state.zones,
  						[newStart.id]: newStart,
  						[newFinish.id]: newFinish,
  					},
  				};

  				this.setState(newState);
  				return;
  			}
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

    deleteButton(timeId, cardId) {
	  this.setState(prevState => {
		let newState = prevState;
		delete newState.cards[cardId];
		for (var i = 0; i < newState.timelines[timeId].cardIds.length; i++)
		{
			if (newState.timelines[timeId].cardIds[i] == cardId) newState.timelines[timeId].cardIds.splice(i,1);
		}
		return newState;
	  });
	  console.log(this.state);
    }

    chooseOption(timeId, item){
    	this.setState(prevState => {
  			let newState = prevState;
  			let cardsLength = Object.keys(this.state.cards).length;
  			let finance;

  			newState.cards['card-' + cardsLength] = { id: "card-" + cardsLength, prompt: "", career: item.career, field: item.field, finance: item.finance, isVisible: true};
  			newState.timelines[timeId].cardIds.push('card-' + cardsLength);

  			return newState;
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

		if (this.state.timelines['time-0'].net < 0)
		{
			netBox = <div><section className="filler"></section><section className="cost"><p>Net Loss: ${this.state.timelines['time-0'].net}</p></section></div>
		}
		else
		{
			netBox = <div className="earnings"><p>Net Gain: ${this.state.timelines['time-0'].net}</p></div>
		}

		return(
				<div className="careerApp">
        		<DragCardsContext onDragEnd={this.onDragEnd}>
        			{/*PULLOUT DRAWER*/}
					<TemporaryDrawer handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
                	<br/>

	                {/*SANDBOX ZONE*/}
	                <SandBox state={this.state}/>
	                <br/>

             	   {/*CAREER & FIELD PANELS*/}
					{this.state.onIntro && <div id="inline">
						<section id="inline">{this.state.showCareers && <CareerPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>}</section>
						<section id="inline">
							{this.state.showFields && <FieldPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
							{!this.state.showFields && <div id="hide"><FieldPanel canDrag={false} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
						</section>
					</div>}

					{/*MAIN ZONE*/}
					<div id="inline">
						<Droppable droppableId="zone-0" type="timeline">
						{(provided, snapshot) => (
						<div className="mainZone" {...provided.droppableProps} ref={provided.innerRef}>
						{this.state.zones['zone-0'].timeIds.map((timeId, index) => {
							const timeline = this.state.timelines[timeId];
							{/*TIMELINE*/}
							return (
								<div>
								<Draggable draggableId={timeline.id} index={index}>
								{(provided, snapshot) => (
								<div {...provided.draggableProps} ref={provided.innerRef}>
									{/*TIMELINE TITLE*/}
									{this.state.showTimelineTitle &&
									<div>
										<div {...provided.dragHandleProps} className="timelineTitle" id="inline"><center><h1>{timeline.title}</h1></center></div>
										<button className="cloneTimeline" id="inline" onClick = {(timeId) => this.cloneTimeline(timeline.id)}>CLONE</button>
										<button className="deleteTimeline" id="inline" onClick = {(timeId) => this.deleteTimeline(timeline.id)}>DELETE</button>
									</div>} 

									{/*TIMELINE EVENTS*/}
									<div id="inline">
									<div id="inline" className="timeline">
									<Droppable droppableId={timeline.id} direction="horizontal" type="card">
									{(provided, snapshot) => (
									<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
									{timeline.cardIds.map((cardId, index) =>{
										const card = this.state.cards[cardId];
										{/*CARD*/}
										return (
											<Draggable draggableId={cardId} index={index}>
											{(provided, snapshot) => (
											<div {...provided.draggableProps} {...provided.dragHandleProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} ref={provided.innerRef} id="inline" className="inlineCard">
												{this.state.cards[cardId].isVisible && <DraggableTarget canDrag={true}
													 card={this.state.cards[cardId]}
													 id={cardId.substring(5)}
													 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}
													 deleteButton={() => this.deleteButton(timeline.id,card.id)}/>}
												{!this.state.cards[cardId].isVisible && <div id="hide"><DraggableTarget canDrag={false}
													 card={this.state.cards[cardId]}
													 id={cardId.substring(5)}
													 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
											</div>)}
											</Draggable>);
									})}
									</div>)}
									</Droppable>
									</div>

									{/*HOW DO I GET THERE?*/}
									{this.state.onIntro && <div id="inline" className="inlineCard">
										{this.state.buttonIsVisible && <Button onClick={() => this.buildTimeline()} style={style}>How do I get there?</Button>}
										{!this.state.buttonIsVisible && <div id="hide"><Button style={style}>How do I get there?</Button></div>}
										<p id="clear">.</p>
										<div className="zilch"></div>
									</div>}

									{/*SUBSEQUENT STEP & TIMELINE INFO*/}
									{!this.state.onIntro && this.state.timelines[timeline.id].cardIds.length > 2 && <div id="inline">
										<div id="inline" className="inlineCard">
											<OptionStack chooseOption={(item)=> this.chooseOption(timeline.id,item)}/>
										</div>
										<div id="inline" className="inlineCard">
											<div className="target" id="whiteBackground">{this.timelineInfo(timeline.id)}</div>
											<p id="clear">.</p>
											<center>{netBox}</center>
										</div>
									</div>}
									</div>
								</div>)}
								</Draggable>
								<br/>
								</div>);
						})}
						{provided.placeholder}
						</div>)}
						</Droppable>
					</div>
					<br/>

					{!this.state.onIntro && <button onClick={()=>this.promptTimeline()} className="generateTimeline">GENERATE NEW TIMELINE</button>}

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
 				</DragCardsContext>
				</div>
		);
	}
}
export default DragDropContext(HTML5Backend)(CareerApp);
