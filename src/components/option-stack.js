//**********************************************
//   option-stack.js   Author: Austin George
//   Prompts the user with a set of 6 options
//**********************************************

import React from 'react';
import Button from '@material-ui/core/Button'; 
import ReactHover from 'react-hover';

class OptionStack extends React.Component {
	state = {
		//SUGGESTIONS
		suggestions: [
			{career: 'Occupation', field: 'Job 1', frequency: .45, finance: 65000},
			{career: 'Occupation', field: 'Job 2', frequency: .23, finance: 62000},
			{career: 'Occupation', field: 'Job 3', frequency: .21, finance: 64000},
			{career: 'Masters', field: 'Degree 1', frequency: .06, finance: -19000},
			{career: 'Masters', field: 'Degree 2', frequency: .03, finance: -19000},
			{career: 'Masters', field: 'Degree 3', frequency: .02, finance: -22000},
		],
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
			background: '#33ccff',
			fontSize: 12,
		};

		const options = {
		  followCursor:true,
		  shiftX: 100,
		  shiftY: 0
		}
		return(
			<div className="optionStack">
			<center><h1>Choose The Next Step:</h1></center>
			{this.state.suggestions.map((item,index) => {
				let percentage = item.frequency * 100;

				let info;

				if (item.finance > 0) info = <div className="hoverBubble" id="green"><center><p>Salary: ${item.finance}</p></center></div>;
				else info = <div className="hoverBubble" id="red"><center><p>Tuition: ${item.finance * -1}</p></center></div>;

				return (
					<ReactHover options={options}>
						<ReactHover.Trigger type='trigger'>
							<div className="optionBar">
							<center>
								<Button onClick={() => this.chooseOption(item)} style={style}>
									<h1>{percentage}% &nbsp;</h1><p><b>{item.career} in {item.field}</b></p>
								</Button>
							</center>
							</div>
						</ReactHover.Trigger>
						<ReactHover.Hover type='hover'>
							<center>{info}</center>
						</ReactHover.Hover>
					</ReactHover>);
				})}
			</div>
		);
	}
}

export default OptionStack