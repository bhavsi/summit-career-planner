import React from 'react';
import PropTypes from 'prop-types';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';

const styles = {
  list: {
    width: 250,
  }
};


class drawer extends React.Component {
  constructor(props){
      super(props);
  };
  

  state = {
    left: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };


  render() {

    return (
      <div>
        <Button onClick={this.toggleDrawer('left', true)}>Open the Drawer</Button>
       
        <SwipeableDrawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div style={{width: 700 }}>
          
            <h1>This is the drawer</h1>
          </div>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
          </div>

        </SwipeableDrawer>
          
      </div>
    );
  }
}

drawer.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default drawer

