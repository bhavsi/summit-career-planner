import React from 'react';
import CareerApp from '../components/career-app.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import FieldPanel from './field-panel.js';
import CareerPanel from './career-panel.js';
import DraggableTarget from './draggable-target.js';
import DraggableSource from './draggable-source.js';
import { DragSource } from 'react-dnd';
import Search from './search-bar.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});


class PersistentDrawerLeft extends React.Component {
  state = {
    open: true,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.props.isOpen) {
      this.setState({ open : this.props.isOpen });
    }
  }


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleDrop = (target, type, name) => {
    return this.props.handleDrop(target, type, name);
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;

  const sideList = (
      <div className={classes.list}>
      <div className="panelpairdrawer">
        <CareerPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
        <FieldPanel handleDrop={(target, type, name) => this.handleDrop(target, type, name)}/>
</div>
      </div>
    );



    return (
      <div>
        <Drawer className={classes.drawer}
        variant="persistent"
        open={open}
        onClose={this.handleDrawerClose}>
            {sideList}

          <Button onClick={this.handleDrawerClose}>
            CLOSE
          </Button>
        </Drawer>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,

};

//const drawer = new TemporaryDrawer();
export default withStyles(styles)(PersistentDrawerLeft);
