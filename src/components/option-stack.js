//**********************************************
//   option-stack.js   Author: Austin George
//   Prompts the user with a set of 6 options
//**********************************************

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import Button from '@material-ui/core/Button';
import ReactHover from 'react-hover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


class OptionStack extends React.Component {
	state = {
		track: "",
		optionA: -1,
		optionB: -1,
	}

	constructor(props){
		super(props);
	    this.chooseOption = this.chooseOption.bind(this);
	};

	//Note: you should set optionA or optionB here
	chooseOption(item, index){
		if(this.state.optionA < 0)
		{
			/*this.setState(prevState => ({
				optionA: index
			}));*/

	  		this.setState(prevState => {
	  			let newState = prevState;
	  			newState.optionA = index;
	  			console.log('bruh: ' + newState.optionA);
	  			return newState;
	  		});
  		}
		return this.props.chooseOption(item);
	}

	setTrack(value) {
		console.log("here's the value: " + value);
	    this.setState(prevState => ({
	    	track: value
	    }));
	  }

	render(){
		//Note: Material UI Buttons require in-code styling
		const style = {
			width:240,
			height: 58,
			background: '#ef7a8b',
			fontSize: 12,
		};

		const options = {
		  followCursor:false,
		  shiftX: 0,
		  shiftY: 0,
		}

		let data = require('../career-data.json');

		let timeline = this.props.timeline;
		let lastCard = this.props.state.cards[timeline.cardIds[timeline.cardIds.length-1]];
		//2nd might be a vulnerability
		let secondCard = this.props.state.cards[timeline.cardIds[1]];
		let track = secondCard.career + " in " + secondCard.field;
		let suggestions;

		if(this.state.optionA < 0)
		{
			suggestions = data.tracks[track].options;
		}
		else if (this.state.optionB < 0)
		{
			suggestions = data.tracks[track].options[this.state.optionA].options;
		}
		else
		{
			suggestions = [
				{career: 'Occupation', field: 'Job 1'},
				{career: 'Occupation', field: 'Job 2'},
				{career: 'Occupation', field: 'Job 3'},
				{career: 'Occupation', field: 'Job 4'},
				{career: 'Occupation', field: 'Job 5'},
				{career: 'Occupation', field: 'Job 6'},
			];
		}
		return(
			<div className="optionStack">
			<center><h1>Choose The Next Step:</h1></center>
			{suggestions.map((item,index) => {
				let info, percentage;

				//UNCOMMENT WHEN HARSH's FINANCE DATA COMES IN
				/*percentage = item.frequency * 100;
				if (item.finance > 0) info = <div className="hoverBubble" id="green"><center><p>10 Yr: ${item.finance}</p></center></div>;
				else info = <div className="hoverBubble" id="red"><center><p>10 Yr: ${item.finance * -1}</p></center></div>;*/

				//TEMPORARY INPUTS
				info = <div className="hoverBubble" id="red"><center><p>10 Yr: $65000</p></center></div>;
				percentage = 16;

				return (
					<ReactHover options={options}>
						<ReactHover.Trigger type='trigger'>
							<div className="optionBar">
							<center>
								<button onClick={() => this.chooseOption(item, index)} className="optionbarstyle">
									<h1>{percentage}% &nbsp;</h1><p className="optionLabel"><b>{item.career} in {item.field}</b></p>
								</button>
							</center>
							</div>
						</ReactHover.Trigger>
						<ReactHover.Hover type='hover'>
							<center>{info.toLocaleString()}</center>
						</ReactHover.Hover>
					</ReactHover>);
				})}
			</div>
		);
	}
}

export default compose(
	firebaseConnect(props => [{ path: 'tracks'}]),
	connect((state, props) => ({
		tracks: state.firebase.data.tracks
	}))
	)(OptionStack)
