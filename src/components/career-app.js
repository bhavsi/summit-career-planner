//***************************************************
//    career-app.js    Author: Austin George
//    Holds everything inside
//***************************************************

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
import SandBox from './Sandbox.js';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import OptionStack from './option-stack.js';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import 'react-reflex/styles.css';

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
			'card-0': { id: "card-0", prompt: "Right now, I'm in ...", career: '', field: '', duration: 0, finance: 0, isVisible: true},
			'card-1': { id: "card-1", prompt: "In the future, I'd like to be in ...", career: '', field: '', duration: 0, finance: 0, isVisible: false},
		},

		//TIMELINES (Abbreviated as "time-#"" for short)
		timelines: {
			'time-0': {
				built: false,
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
		age: 17,
		gradDate: 2020,
		onIntro: true,
		showFields: false,
		showCareers: true,
		showNet: false,
	    showButtons: false,
	    showTimelineTitle: false,
      isTempDrawerOpen: false,
	}

	constructor(props){
		super(props);
		this.onDragEnd = this.onDragEnd.bind(this);
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

	indexOfCard = (timeId,cardId) => {
		for (var i = 0; i < this.state.timelines[timeId].cardIds.length; i++)
		{
			let currCardId = this.state.timelines[timeId].cardIds[i];
			if (cardId == currCardId) return i;
		}
	}
	//Executed whenever a field/career is dragged & dropped
	updateTarget = (target, type, name) => {
		this.setState(prevState => {
			let newState = prevState;

			//REMOVE SOURCE FROM TARGET
			if (target % 1 != 0)
			{
				let cardId = 'card-' + (target-.1);
				newState.cards[cardId][type] = "";
				return newState;
			}

			//ADD SOURCE TO TARGET
			let cardId = 'card-' + target;
			let timeId = this.findTimeline(cardId); //Heavy Command
			let firstCardId = newState.timelines[timeId].cardIds[0];
			let secondCardId = newState.timelines[timeId].cardIds[1];
			let visibility;

			newState.cards[cardId][type] = name;

			//Prompt Graduation Date
			if(type == 'career' && firstCardId == cardId && name != 'Occupation') newState.openGradDate = true;


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
  			newState.cards[cardA] = { id: cardA, prompt: "Right now, I'm in ...", career: '', field: '', duration: 0, finance: 0, isVisible: true},
  			newState.cards[cardB] = { id: cardB, prompt: "In the future, I'd like to be in ...", career: '', field: '', duration: 0, finance: 0, isVisible: false},

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
  			newState.buttonIsVisible = false;
  			newState.showNet = true;
  			newState.onIntro = false;
       		newState.showButtons = true;
       		newState.showTimelineTitle = true;
       		newState.timelines['time-0'].built = true;

       		//***TEMPORARY SAMPLE CODE***
  			//For test purposes only.
  			//Ultimately, relevant data/cards will be placed here.
  			newState.cards['card-0'].duration = newState.gradDate - 2019;

  			if(newState.cards['card-1'].career === 'Bachelors')
  			{
  				newState.cards['card-1'].finance = -25000;
  				newState.cards['card-1'].duration = 4;
  			}
  			else
  			{
	  			newState.cards['card-1'].finance = 80000;
	  			newState.cards['card-1'].duration = 5; //alternative: cap off total duration to 10
	  			newState.cards['card-' + cardsSize] = { id: "card-" + cardsSize, prompt: "", career: 'Bachelors', field: 'Engineering', duration: 4, finance: -35000, isVisible: true};
	  			newState.cards['card-' + (cardsSize + 1)] = { id: "card-" + (cardsSize + 1), prompt: "", career: 'Masters', field: 'Computer Science', duration: 2, finance: -21000, isVisible: true};
	  			newState.timelines['time-0'].cardIds.splice(1,0,'card-' + cardsSize);
	  			newState.timelines['time-0'].cardIds.splice(2,0,'card-' + (cardsSize + 1));
  			}

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
				built: true,
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
  				newState.cards[newCardId] = { id: newCardId, prompt: "", career: currCard.career, field: currCard.field, duration: currCard.duration, finance: currCard.finance, isVisible: true};
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

    addButton(timeId,cardId) {
    	this.setState(prevState => {
  			let newState = prevState;
  			let timelinesLength = Object.keys(this.state.timelines).length;
  			let cardsLength = Object.keys(this.state.cards).length;
  			let newCardId = 'card-' + (cardsLength);
  			let index = this.indexOfCard(timeId,cardId) + 1;
  			newState.cards[newCardId] = { id: newCardId, prompt: "Drag a career & field from the drawer", career: "", field: "", duration: 0, finance: 0, isVisible: true};
  			newState.timelines[timeId].cardIds.splice(index,0,newCardId);
  			return newState;
  		});
    }

    deleteButton(timeId, cardId) {
	  this.setState(prevState => {
		let newState = prevState;
		for (var i = 0; i < newState.timelines[timeId].cardIds.length; i++)
		{
			if (newState.timelines[timeId].cardIds[i] == cardId) newState.timelines[timeId].cardIds.splice(i,1);
		}
		return newState;
	  });
	  console.log(this.state);
    }


    exploreButton() {
      console.log('Redirecting to another page...');
    }

    locationButton() {
      console.log('Pick a location from the drop down menu');
    }

    chooseOption(timeId, item){
    	this.setState(prevState => {
  			let newState = prevState;
  			let cardsLength = Object.keys(this.state.cards).length;
  			let finance;

  			newState.cards['card-' + cardsLength] = { id: "card-" + cardsLength, prompt: "", career: item.career, field: item.field, duration: item.duration, finance: item.finance, isVisible: true};
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
	  	marginBottom: 15,
		};



		return(
				<div className="careerApp">
        		<DragCardsContext onDragEnd={this.onDragEnd}>
        			{/*PULLOUT DRAWER*/}
					{this.state.timelines['time-0'].built && <div>


	                {/*SANDBOX ZONE*/}
	                <SandBox state={this.state}/>
	                </div>}

             	   {/*CAREER & FIELD PANELS*/}
					<div id="inline">
            <div className = "panels">
						<section id="inline">{this.state.showCareers && <CareerPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>}</section>
						<section id="inline">
							{this.state.showFields && <FieldPanel canDrag={true} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
							{!this.state.showFields && <div id="hide"><FieldPanel canDrag={false} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
						</section>
            </div>
					</div>


					{/*MAIN ZONE*/}
					<div id="inline">

						<Droppable droppableId="zone-0" type="timeline">
						{(provided, snapshot) => (
						<div className="mainZone" {...provided.droppableProps} ref={provided.innerRef}>
						{this.state.zones['zone-0'].timeIds.map((timeId, index) => {
							const timeline = this.state.timelines[timeId];
							let net = 0;

							for (var i = 0; i < this.state.timelines[timeline.id].cardIds.length; i++)
							{
								let currCard = this.state.timelines[timeline.id].cardIds[i];
								net+= this.state.cards[currCard].finance;
							}

							let netBox;
							if (net < 0) netBox = <div><section className="filler"></section><section className="cost"><p>Net Loss: ${net.toLocaleString()}</p></section></div>;
							else netBox = <div className="Netearnings"><p>Net Gain: ${net.toLocaleString()}</p></div>;

							{/*TIMELINE*/}
							return (
								<div>
								<Draggable draggableId={timeline.id} index={index}>
								{(provided, snapshot) => (
								<div {...provided.draggableProps} ref={provided.innerRef}>
									{/*TIMELINE TITLE - UNCOMMENT TO REIMPLEMENT
									{this.state.showTimelineTitle &&
									<div>
										<div {...provided.dragHandleProps} className="timelineTitle" id="inline"><center><h1>{timeline.title}</h1></center></div>
										<button className="cloneTimeline" id="inline" onClick = {(timeId) => this.cloneTimeline(timeline.id)}>CLONE</button>
										<button className="deleteTimeline" id="inline" onClick = {(timeId) => this.deleteTimeline(timeline.id)}>DELETE</button>
									</div>}*/}

									{/*TIMELINE EVENTS*/}
									<div id="inline">
									<div id="inline" className="timeline">
									<Droppable droppableId={timeline.id} direction="horizontal" type="card">
									{(provided, snapshot) => (
									<div ref={provided.innerRef} style={getListSpecs(snapshot.isDraggingOver)} {...provided.droppableProps}>
									{timeline.cardIds.map((cardId, index) =>{
										const card = this.state.cards[cardId];
										let totalTime = 0;
										for (var i = 0; i <= index; i++)
										{
											let currCard = this.state.cards[this.state.timelines[timeline.id].cardIds[i]];
											totalTime += currCard.duration;
										}
										let age = this.state.age + totalTime;
										let date = 2019 + totalTime;

										{/*CARD*/}
										return (
											<div>
												{timeline.built && <div>
													{index == 0 && <div id="inline">
														<div id="inline">
															<p>Complete By</p>
															<p>Age</p>
														</div>
														<div className="timeStampX" id="inline">
															<p>{date}</p>
															<p>{age} y/o</p>
														</div>
													</div>}
													{index != 0 && <div className="timeStamp" id="inline">
														<p>{date}</p>
														<p>{age} y/o</p>
													</div>}
													<div className="timeBar">
													</div>
												</div>}
											<Draggable draggableId={cardId} index={index}>
											{(provided, snapshot) => (
											<div {...provided.draggableProps} style={getItemSpecs(snapshot.isDragging, provided.draggableProps.style)} ref={provided.innerRef}>
												<div {...provided.dragHandleProps}></div>
												{timeline.built && <div>
													<div className="timeHandle"/>
													<div className="cardBackground" {...provided.dragHandleProps}></div>
												</div>}

												<div className="clear" id="inline">
													{this.state.cards[cardId].isVisible && <DraggableTarget canDrag={true}
														 timeline={timeline}
														 card={this.state.cards[cardId]}
														 id={cardId.substring(5)}
														 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}
														 deleteButton={() => this.deleteButton(timeline.id,card.id)}
														 addButton={() => this.addButton(timeline.id,card.id)}
														 locationButton={() => this.locationButton()}
							                             exploreButton={() => this.exploreButton()}/>}
													{!this.state.cards[cardId].isVisible && <div id="hide"><DraggableTarget canDrag={false}
														 timeline={timeline}
														 card={this.state.cards[cardId]}
														 id={cardId.substring(5)}
														 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/></div>}
												</div>
											</div>)}
											</Draggable>
											</div>);
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
									{!this.state.onIntro && this.state.timelines[timeline.id].built && <div id="inline">
										<div id="inline" className="inlineCard">
											<OptionStack state={this.state} timeline={timeline} chooseOption={(item)=> this.chooseOption(timeline.id,item)}/>
										</div>
										<div id="inline" className="inlineInfo">
											<div className="cardBackground" {...provided.dragHandleProps}></div>
											<div className="target" id="whiteBackground">
												{this.timelineInfo(timeline.id)}
												<button className="cloneTimeline" id="inline" onClick = {(timeId) => this.cloneTimeline(timeline.id)}>CLONE</button>
												<button className="deleteTimeline" id="inline" onClick = {(timeId) => this.deleteTimeline(timeline.id)}>DELETE</button>
											</div>
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
 						<DialogTitle>Tell Us A Little About Yourself</DialogTitle>
 						<DialogContent>
 							<DialogContentText>
 								This will help us provide a relevant timeline!
 							</DialogContentText>
 							<br/>
 							<FormControl>
 								<p>Age</p>
 								<Select width="50" value={this.state.age} onChange={this.handleChange('age')}>
 									<option value=""/>
 									<option value={13}>13</option>
 									<option value={14}>14</option>
 									<option value={15}>15</option>
 									<option value={16}>16</option>
 									<option value={17}>17</option>
 									<option value={18}>18</option>
 									<option value={19}>19</option>
 									<option value={20}>20</option>
 									<option value={21}>21</option>
 								</Select>
 								<br/>
 								<p>Expected Graduation Date</p>
 								<Select width="50" value={this.state.gradDate} onChange={this.handleChange('gradDate')}>
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
