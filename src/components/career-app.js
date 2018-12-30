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
			{ prompt: 'You Are Here', career: '', field: '', isVisible: true},
			{ prompt: "In the future, I'd like too ...", career: '', field: '', isVisible: false},
		],
		lowerBound: 0,
		buttonIsVisible: false,
		openGradDate: false,
		gradDate: 2020,
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
				else if(target == 1 && targets[1].career != "")
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
			return {targets, lowerBound, buttonIsVisible, openGradDate, gradDate};
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

		return(
				<div className="careerApp">
					<TemporaryDrawer handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>

					<FieldPanel  handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>
					<CareerPanel handleDrop={(target, type, name) => this.updateTarget(target, type, name)} lowerBound={this.state.lowerBound} changeLB={(newLB) => this.changeLB(newLB)}/>
					<div id="inline">

					{this.state.targets[0].isVisible && <DraggableTarget prompt={this.state.targets[0].prompt} index={0} career={this.state.targets[0].career} field={this.state.targets[0].field} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}
					{this.state.targets[1].isVisible && <DraggableTarget prompt={this.state.targets[1].prompt} index={1} career={this.state.targets[1].career} field={this.state.targets[1].field} handleDrop={(target, type, name) => this.updateTarget(target, type, name)}/>}

					{this.state.buttonIsVisible && <Button style={style}>How do I get there?</Button>}
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
