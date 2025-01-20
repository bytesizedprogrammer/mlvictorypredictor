// IGNORE, THIS WAS AND WILL BE USED FOR TESTING THINGS

import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [likelihoodOfLosing, setLikelihoodOfLosing] = useState('');


  useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await fetch('http://localhost:5000/receivelikelihood');
      const data = await response.json();
      console.log(data);
      setMessage(data.message);

      try {
      const likelihoodOfLosing = data.data[0].likelihoodOfLosing;
      setLikelihoodOfLosing(likelihoodOfLosing); 
      } catch (err) {
        console.error("Error: ", err); 
      }

    }, 1000); // Runs every 1000ms (1 second)
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="App">
       <p>{message}</p>
       <p>{likelihoodOfLosing}</p>
    </div>
  );
}

export default App;
