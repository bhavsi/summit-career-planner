//**********************************************
//   option-stack.js   Author: Austin George
//   Prompts the user with a set of 6 options
//**********************************************

import React from 'react';
import Button from '@material-ui/core/Button'; 

class OptionStack extends React.Component {
	state = {
		//SUGGESTIONS
		suggestions: [
			{career: 'Occupation', field: 'Job 1', frequency: .45},
			{career: 'Occupation', field: 'Job 2', frequency: .23},
			{career: 'Occupation', field: 'Job 3', frequency: .21},
			{career: 'Masters', field: 'Degree 1', frequency: .06},
			{career: 'Masters', field: 'Degree 2', frequency: .03},
			{career: 'Masters', field: 'Degree 3', frequency: .02},
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

		return(
			<div className="optionStack">
			<center><h1>Choose The Next Step:</h1></center>
			{this.state.suggestions.map((item,index) => {
				let percentage = item.frequency * 100;
				return (
				<div className="optionBar">
					<center>
						<Button onClick={() => this.chooseOption(item)} style={style}>
							<h1>{percentage}% &nbsp;</h1><p><b>{item.career} in {item.field}</b></p>
						</Button>
					</center>
				</div>);
			})}
			</div>
		);
	}
}

export default OptionStack