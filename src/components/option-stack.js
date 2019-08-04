//**********************************************
//   option-stack.js   Author: Austin George
//   Prompts the user with a set of 6 options
//**********************************************

import React from 'react';
import Button from '@material-ui/core/Button';
import ReactHover from 'react-hover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


class OptionStack extends React.Component {
	state = {
	}

	constructor(props){
		super(props);
	    this.chooseOption = this.chooseOption.bind(this);
	};

	chooseOption(career,field){
		return this.props.chooseOption(career,field);
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

		let timeline = this.props.timeline;
		console.log("Hopeful Last Card ID:" + timeline.cardIds[timeline.cardIds.length-1]);
		let lastCard = this.props.state.cards[timeline.cardIds[timeline.cardIds.length-1]];
		let suggestions;

		//TEMPORARY LOGIC: Serves to demonstrate proof of concept
		if(lastCard.career === 'Bachelors')
		{
			suggestions = [
				{career: 'Masters', field: 'Degree 1', frequency: .06, duration: 2, finance: -19000},
				{career: 'Masters', field: 'Degree 2', frequency: .03, duration: 2, finance: -19000},
				{career: 'Masters', field: 'Degree 3', frequency: .02, duration: 2, finance: -22000},
				{career: 'Occupation', field: 'Job 1', frequency: .45, duration: 5, finance: 65000},
				{career: 'Occupation', field: 'Job 2', frequency: .23, duration: 5, finance: 62000},
				{career: 'Occupation', field: 'Job 3', frequency: .21, duration: 5, finance: 64000},
			];
		}
		else if (lastCard.career === 'Masters')
		{
			suggestions = [
				{career: 'Doctorate', field: 'Degree 1', frequency: .03, duration: 2, finance: -19000},
				{career: 'Doctorate', field: 'Degree 2', frequency: .02, duration: 2, finance: -19000},
				{career: 'Doctorate', field: 'Degree 3', frequency: .01, duration: 2, finance: -22000},
				{career: 'Occupation', field: 'Job 1', frequency: .53, duration: 5, finance: 95000},
				{career: 'Occupation', field: 'Job 2', frequency: .26, duration: 5, finance: 115000},
				{career: 'Occupation', field: 'Job 3', frequency: .15, duration: 5, finance: 120000},
			];
		}
		else
		{
			suggestions = [
				{career: 'Occupation', field: 'Job 1', frequency: .43, duration: 2, finance: 140000},
				{career: 'Occupation', field: 'Job 2', frequency: .21, duration: 2, finance: 152000},
				{career: 'Occupation', field: 'Job 3', frequency: .17, duration: 2, finance: 150000},
				{career: 'Occupation', field: 'Job 4', frequency: .11, duration: 5, finance: 160000},
				{career: 'Occupation', field: 'Job 5', frequency: .05, duration: 5, finance: 174000},
				{career: 'Occupation', field: 'Job 6', frequency: .03, duration: 5, finance: 220000},
			];
		}
		return(
			<div className="optionStack">
			<center><h1>Choose The Next Step:</h1></center>
			{suggestions.map((item,index) => {
				let percentage = item.frequency * 100;

				let info;

				if (item.finance > 0) info = <div className="hoverBubble" id="green"><center><p>10 Yr: ${item.finance}</p></center></div>;
				else info = <div className="hoverBubble" id="red"><center><p>10 Yr: ${item.finance * -1}</p></center></div>;

				return (
					<ReactHover options={options}>
						<ReactHover.Trigger type='trigger'>
							<div className="optionBar">
							<center>
								<Button onClick={() => this.chooseOption(item)} style={style}>
									<h1>{percentage}% &nbsp;</h1><p className="optionLabel"><b>{item.career} in {item.field}</b></p>
								</Button>
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

export default OptionStack
