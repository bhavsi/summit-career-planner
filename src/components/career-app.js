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

class CareerApp extends React.Component {
	state = {
		targets: [
			{ prompt: 'You Are Here', career: '', field: '', finance: 0, isVisible: true},
			{ prompt: "In the future, I'd like to ...", career: '', field: '', finance: 0, isVisible: false},
		],
		lowerBound: 0,
		buttonIsVisible: false,
		openGradDate: false,
		gradDate: 2020,
		showPanels: true,
		showNet: false,
		net: 0,
	}

	constructor(props){
		super(props);
	};

	//Executed whenever a field/career is selected
	updateTarget = (target, type, name) => {
		this.setState(prevState => {
			let targets = prevState.targets;
			let lowerBound = prevState.lowerBound;
			let buttonIsVisible = prevState.buttonIsVisible;
			let openGradDate = prevState.openGradDate;
			let gradDate = prevState.gradDate;
			let showPanels = prevState.showPanels;
			let showNet = prevState.showNet;
			let net = prevState.net;

			//ADD SOURCE TO TARGET
			if (target % 1 == 0)
			{
				if(type == 'career')
				{
					targets[target].career = name;
				}
				else if (type == 'field')
				{
					targets[target].field = name;
				}

				if(target == 0 && targets[0].career != "")
				{
					targets[1].isVisible = true;
				}
				else if(targets[target].prompt == "In the future, I'd like to ..." && targets[target].career != "")
				{
					buttonIsVisible = true;
				}

				if(type == 'career' && target == 0 && name != 'Occupation')
				{
					openGradDate = true;
				}
			}

			//REMOVE SOURCE FROM TARGET
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

			//Upon receiving this info, additional timeline items can be inserted HERE
			return {targets, lowerBound, buttonIsVisible, openGradDate, gradDate, showPanels, showNet, net};
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
			newState.showPanels = false;
  			newState.buttonIsVisible = false;
  			newState.showNet = true;

  			//***SAMPLE CODE***
  			//For test purposes only.
  			//Ultimately, relevant data/cards will be placed here.
			newState.targets[1].finance = 80000;
  			newState.targets.splice(1,0,{prompt: '', career: 'Bachelors', field: 'Engineering', finance: -35000, isVisible: true});
  			newState.targets.splice(2,0,{prompt: '', career: 'Masters', field: 'Computer Science', finance: -21000, isVisible: true});

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
			netBox = <div><section className="filler"></section><section className="earnings"><p>Net Gain: ${this.state.net}</p></section></div>
		}

		return(
				<div className="careerApp">
					<TemporaryDrawer handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

					{this.state.showPanels && <FieldPanel  handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
					{this.state.showPanels && <CareerPanel handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>}
					

					{this.state.targets.map((item, index) => (
						<div id="inline">
						{this.state.targets[index].isVisible && <DraggableTarget prompt={this.state.targets[index].prompt} 
																				 index={index}
																				 career={this.state.targets[index].career} 
																				 field={this.state.targets[index].field} 
																				 finance={this.state.targets[index].finance}
																				 handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
						</div>
					))}
					
					<div id="inline">
						{this.state.buttonIsVisible && <Button onClick={this.buildTimeline} style={style}>How do I get there?</Button>}
						{this.state.showNet && <div>{netBox}</div>}
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
		)
	}
}
export default DragDropContext(HTML5Backend)(CareerApp);
