import React from 'react'
import './App.css'

import Advanced from './advanced/Advanced';
import SessionManager from './session-organizer/sessionManager';
import WaitingRoom from './waitingroom/waitingRoom';
const io = require("socket.io-client");
const socket = io();

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasSession: false,
      code: "",
      continue: false
    };
    this.hasSessionhandler = this.hasSessionhandler.bind(this)
    this.continueHandler = this.continueHandler.bind(this)
  }

  continueHandler(){
    socket.emit('continue', this.state.code); 
  }


  hasSessionhandler(code) {
    // Dont call unless code not empty
    if (code !== "") {
      console.log('Message from client: Asking to join room ' + code);
      socket.emit('create or join', code);
    }

    // Set code to pass as prop
    this.setState({
      code: code
    })

    // Everything is okay
    this.setState({
      hasSession: true
    })
  }
  
  render(){

    var isInitiator;

    socket.on('log', function(array) {
      console.log.apply(console, array);
    });

    socket.on('joined', function(room, clientId) {
      isInitiator = false;
      // Everything was successful change state to hasSession
    });

    socket.on('log', function(array) {
      console.log.apply(console, array);
    });

    socket.on('created', function(room, clientId) {
      isInitiator = true;
    });

    socket.on('full', function(room) {
      console.log('Message from client: Room ' + room + ' is full :^(');
    });

    socket.on('setContinue', ()=>{
      this.setState({
        continue: true
      })
    });

    const hasSession = this.state.hasSession;
    const continueClicked = this.state.continue;

    let display;
    if (hasSession && continueClicked) {
      display = <Advanced code={this.state.code} socket={socket}/>;
    } else if (hasSession) {
      display = <WaitingRoom code={this.state.code} handler={this.continueHandler} socket={socket}/>;
    } else {
      display = <SessionManager handler={this.hasSessionhandler}/>;
    }

    return (
      <div className='app'>
        {display}
      </div>
    )
  }
}

export default App
