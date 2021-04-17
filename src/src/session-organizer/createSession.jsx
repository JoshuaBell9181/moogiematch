import React from 'react'

class CreateSession extends React.Component {
    constructor(props) {
      super(props);
    }

    generateRandomCode(){
      return Math.random().toString(20).substr(2,6);
    }
  
    render() {
  
      const code = this.generateRandomCode();

      return (
        <div>
          <button onClick= {() => this.props.handler(code)}>Start Session</button>
        </div>
      );
    }
}
  
export default CreateSession;