import React, { useEffect, useState } from 'react'
const io = require("socket.io-client");
const socket = io();

function WaitingRoom (props) {

    const [numOfpeople, setNumOfpeople] = useState(1)

    useEffect(()=>{
        props.socket.on('joined', (numClients) => {
            setNumOfpeople(numClients);
        }) 
    })

    useEffect(()=>{
        alert("Once everyone from your party has entered click continue to proceed")
    },[])

    return (
    <div>
        <h1>Moogie Match</h1>
        <h2>Number of people in session: {numOfpeople}</h2>
        <h2>Session ID: {props.code}</h2>
        <button onClick={props.handler}>Continue</button>
    </div>
    );
    
}
  
export default WaitingRoom;