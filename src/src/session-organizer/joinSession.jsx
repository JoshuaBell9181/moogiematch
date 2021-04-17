import React from 'react'

class JoinSession extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        code: "",
      }

      this.onChange = this.onChange.bind(this);
    }

    onChange(event){
      this.setState({[event.target.name] : event.target.value})
    }
  
    render() {
  
      return (
        <div>
          <br></br>
          <input type="text" placeholder="Session ID" onChange={this.onChange} name="code"></input>
          <button onClick= {() => this.props.handler(this.state.code)}>Join Session</button>
        </div>
      );
    }
}
  
export default JoinSession;