
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

/*
 * App state for Memory:
 *
 * {selected1: -1, selected2: -1, matchedTiles: [], buttonValues: [], numberOfMoves: 0};
 */


export default function init_game(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);

	this.channel = props.channel;    
    {/* Attribution: Ramdomizing logic https://javascript.info/task/shuffle*/}
	this.state = {selected1: -1, selected2: -1, matchedTiles: [], buttonValues: [], numberOfMoves: 0};
	this.channel.join()
           .receive("ok", this.onJoin.bind(this))
           .receive("error", resp => { console.log("Unable to join", resp) });
           
    this.isGameLoaded = false;
    this.buttonPressed = this.buttonPressed.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.buttonArray = [];
	this.isButtonPressed = false;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  onJoin({game}) {
	this.isGameLoaded = true;
    this.setState(game);
  }

  onCorrectSelection({game}) {
  	this.isButtonPressed = true;
	this.isGameLoaded = true;
    this.setState(game);
  }
  
  onWrongSelection({game}) {
	this.isButtonPressed = false;
  	this.interval = setInterval(() => {
      	this.setState(prevState => ({
        	seconds: prevState.seconds + 1
      	}));
      	if (this.isButtonPressed == false) {
      		this.isButtonPressed = false;
			let state1 = _.assign({}, this.state, { selected1: -1, selected2: -1});
	      	this.setState(state1);
      	}
      	clearInterval(this.interval);
    }, 1000);
    this.setState(game);
  }
  
  buttonPressed(buttonValue) {
  	clearInterval(this.interval);
    this.channel.push("selectGrid", { letter: buttonValue })
    	.receive("correct", this.onCorrectSelection.bind(this))
    	.receive("wrong", this.onWrongSelection.bind(this));
  }
  
  resetGame() {
    this.channel.push("reset", 1)
    	.receive("ok", this.onJoin.bind(this));
  }
  
  render() {
    var i;
    this.buttonArray = []
	for (i = 0; i < 16; i++) {
	    let j = i;
	    var htmlText = "";
	    if (this.state.matchedTiles.includes(j)) {
			let button1 = <div className="column selected" onClick={() => this.buttonPressed(j)}>{this.state.buttonValues[j]}</div>;
			this.buttonArray.push(button1);	    	
	    }
	    else {
			if (this.state.selected1 == j || this.state.selected2 == j) {
	      		htmlText = this.state.buttonValues[j];
			}
			let button1 = <div className="column" onClick={() => this.buttonPressed(j)}>{htmlText}</div>;
			this.buttonArray.push(button1);	
	    }
	}
	
	let button = <div className="Reset"><p><button onClick={() => this.resetGame()}>Reset Game</button></p></div>;
	    
    	if (this.state.matchedTiles.length == 16) {
    		return (
	    		<div className="container">
	    			<div className="header"><h3>Memory Game</h3></div>
	    			<div className="score"><h3>Points Scored: {100 - this.state.numberOfMoves}</h3></div>
	   	 	 		<div className="reset">
	   	 	 			{button}
	   	 	 		</div>
    			</div>);
    	}
    	else {
    		if (this.isGameLoaded == false) {
				return (
	    			<div className="container">
    				</div>);
    		}
    		else {
    			return (
	    			<div className="container">
	    				<div className="header"><h3>Memory Game</h3></div>
	    				<div className="table">
	    	 			<div className="row">
	    					{this.buttonArray[0]}{this.buttonArray[1]}{this.buttonArray[2]}{this.buttonArray[3]}
	    	 			</div>
	    	 			<div className="row">
	   	 					{this.buttonArray[4]}{this.buttonArray[5]}{this.buttonArray[6]}{this.buttonArray[7]}
	   	 	 			</div>
	   	 	 			<div className="row">
	   	 					{this.buttonArray[8]}{this.buttonArray[9]}{this.buttonArray[10]}{this.buttonArray[11]}
	   	 	 			</div>
	   	 	 			<div className="row">
	   	 					{this.buttonArray[12]}{this.buttonArray[13]}{this.buttonArray[14]}{this.buttonArray[15]}
	   	 	 			</div>
	   	 	 			<div className="rowLast"></div>
	   	 				</div>
	   	 	 			<div className="reset">
	   	 	 				{button}
	   	 	 			</div>
    				</div>);
    		}
    	}
	}
}

