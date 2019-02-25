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
			{career: 'Masters', field: 'Degree 1'},
			{career: 'Masters', field: 'Degree 2'},
			{career: 'Masters', field: 'Degree 3'},
			{career: 'Occupation', field: 'Job 1'},
			{career: 'Occupation', field: 'Job 2'},
			{career: 'Occupation', field: 'Job 3'},
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
			width:230,
			height: 58,
			background: '#33ccff',
		};

		return(
			<div className="optionStack">
			<center><h1>Choose The Next Step:</h1></center>
			{this.state.suggestions.map((item,index) => {
				return (
				<div className="optionBar">
					<center>
						<Button onClick={() => this.chooseOption(item.career,item.field)} style={style}>
							{item.career} in {item.field}
						</Button>
					</center>
				</div>);
			})}
			</div>
		);
	}
}

export default OptionStack