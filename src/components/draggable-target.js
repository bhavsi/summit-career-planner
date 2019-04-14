//***************************************************
//   draggable-target.js    Author: Austin George
//   Receives a draggable source (field OR career)
//   Structure: Place inside entire timeline app
//***************************************************

import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import DraggableSource from './draggable-source.js';
import Button from '@material-ui/core/Button';
import Search from './search-bar.js';

const itemTarget = {
	drop(props, monitor, component){
		return {id: props.id};
	}
}

function collect(connect, monitor){
	return{
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem(),
	}
}


class DraggableTarget extends React.Component {
	constructor(){
	super();

 this.state = {
       displayMenu: false,
     };

  this.showDropdownMenu = this.showDropdownMenu.bind(this);
  this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
}

showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }

	handleDrop = (target, type, name) => {
		if (target < 0)
		{
			return this.props.handleDrop(parseInt(this.props.id) + .1, type, name);
		}
		else
		{
			return this.props.handleDrop(target, type, name);
		}
	}

	deleteButton = () => {return this.props.deleteButton();}
	addButton = () => {return this.props.addButton();}

	render(){
		const { connectDropTarget, hovered, item } = this.props;
		const backgroundColor = hovered ? 'lightblue' : 'white';

		let content;

		if (this.props.card.career === '' && this.props.card.field === '')
		{
			content = <p className="promptCard"><b>{this.props.card.prompt}</b></p>;
		}
		else if (this.props.card.career === '')
		{
			content = <DraggableSource canDrag={this.props.canDrag} type="field" item={{name: this.props.card.field}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>;
		}
		else if(this.props.card.field === '')
		{
			content = <DraggableSource canDrag={this.props.canDrag} type="career" item={{name: this.props.card.career}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>;
		}
		else
		{
			content = <div>
						<DraggableSource canDrag={this.props.canDrag} targetIndex = {this.props.index} type="career" item={{name: this.props.card.career}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
						<p>in</p>
						<DraggableSource canDrag={this.props.canDrag} targetIndex = {this.props.index} type="field" item={{name: this.props.card.field}} handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
						</div>
		}

		let label;

		if (this.props.card.prompt == "Right now, I'm in ..." && this.props.card.career != '') label = <center><p><b>You Are Here</b></p></center>
		else if (this.props.card.prompt == "In the future, I'd like to be in ..." && this.props.card.career == '' && this.props.card.field != "") label = <center><p><i>Please enter a career</i></p></center>
		else if (this.props.card.prompt == "In the future, I'd like to be in ..." && this.props.card.career != '') label = <center><p><b>Your Goal</b></p></center>
		else label = <p id="clear">.</p>

		let costEarnings;

		if (this.props.card.finance > 0) costEarnings = <div className="earnings"><p>+{this.props.card.finance}</p></div>
		else if (this.props.card.finance < 0) costEarnings = <div className="cost"><p>{this.props.card.finance}</p></div>
		else costEarnings = <div className="zilch"></div>;

		return connectDropTarget(
			<div>
				<div id="inline">
				<div className = "target" style = {{ background: backgroundColor}}>
					{this.props.canDrag && this.props.timeline.built && <div className="cardButtons">
						<p id="inline" className="subcardDuration">{this.props.card.duration} years</p>
						{this.props.timeline.cardIds.length > 1 && <button id="inline" className="subcardButtons" onClick = {() => this.deleteButton()}>✖️</button>}
					</div>}
					<span>{content}</span>
				</div>
				{label}
				<center>{costEarnings}</center>
				</div>
				{this.props.timeline.built && <div id="inline">
					<button id="inline" className="addButton" onClick = {() => this.addButton()}>➕</button>
				</div>}
			</div>
		);

	}


}
export default DropTarget('item', itemTarget, collect)(DraggableTarget);
