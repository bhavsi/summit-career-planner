import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom'

class Header extends React.Component{
    constructor(props){
	super(props);
	this.state = {
	    snackbar: {
		open: false,
		message: null
	    }
	}
    }
    
    logout(){
	this.props.firebase.logout();
	this.setState({
	    snackbar: {
		open: true,
		message: <p>Goodbye!</p>
	    }
	});
    }

    closeSnackbar(event, reason){
	if(reason == "clickaway"){
	    // do nothing
	    return;
	}
	this.setState({
	    snackbar: {
		open: false
	    }
	});
    }
    
    render(){
	let greeting;
	if(!this.props.auth.isLoaded){
	    // auth is still warming up
	    // so unsure if user is logged in or not;
	    greeting = null;
	}
	if(this.props.auth.isLoaded && !this.props.auth.isEmpty){
	    // user is logged in!
	    greeting = <span>Hello {this.props.auth.email}!
		<Link to="/sandwiches">
		    <Button variant="contained"
			style={{marginLeft: 30}}
			    color="secondary">
			Muh Sandwiches
		    </Button>
	    	</Link>

		<Button color="inherit"
			onClick={() => {this.logout();}}
		>Logout</Button>
	    </span>;
	}
	if(this.props.auth.isLoaded && this.props.auth.isEmpty){
	    // user is not logged in
	    greeting =
		<span>
		    <Link to="/login">
			<Button color="inherit">
			Login
			</Button>
	    	    </Link>
		    <Link to="/signup">
			<Button color="secondary" variant="contained">
			Signup
			</Button>
	    	    </Link>
		</span>
	    ;
	}

	return(
	    <div>
		<AppBar>
		    <Toolbar>
			    <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
				<Link to="/">
				    Summit Career Planner
				</Link>
			    </Typography>
			<div>
			    {greeting}
			</div>
		    </Toolbar>
		</AppBar>
		<Snackbar
		    anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'left',
		    }}
		    open={this.state.snackbar.open}
		    autoHideDuration={2500}
		    onClose={(event, reason) => {this.closeSnackbar(event, reason);}}
		    message={this.state.snackbar.message}
		/>
	    </div>
	);
    }
}

export default compose(
    firebaseConnect(),
    connect(({firebase: {auth}}) => ({auth}))
)(Header);
