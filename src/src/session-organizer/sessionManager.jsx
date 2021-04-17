import React from 'react'
import CreateSession from './createSession'
import JoinSession from './joinSession'

class SessionManager extends React.Component {

    constructor(props){
        super(props)
    }
  
    render() {
      return (
        <div>
          <h1>Moogie Match</h1>
          <CreateSession handler={this.props.handler}/>
          <h1> -Or- </h1>
          <JoinSession handler={this.props.handler}/>
        </div>
      );
    }
}
  
export default SessionManager;