import React, { useState } from 'react';
import './InterviewPopup.Module.css';
import axios from 'axios';

function InterviewPopup({ onClose,username,jobName,company }) {
  const [dates, setDates] = useState(['', '', '']);
  const [startTimes, setStartTimes] = useState(['', '', '']);
  const [endTimes, setEndTimes] = useState(['', '', '']);
  const [error, seterror] = useState('');


  

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleStartTimeChange = (index, value) => {
    const newStartTimes = [...startTimes];
    newStartTimes[index] = value;
    setStartTimes(newStartTimes);
  };

  const handleEndTimeChange = (index, value) => {
    const newEndTimes = [...endTimes];
    newEndTimes[index] = value;
    setEndTimes(newEndTimes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nameofjobsArray = Array(dates.length).fill(jobName);  // Create an array with repeated jobName
      const usernamesArray = Array(dates.length).fill(username);  // Create an array with repeated username
      const companysArray = Array(dates.length).fill(company);  // Create an array with repeated username
      const zoomlinksArray = Array(dates.length).fill(zoomlink);  // Create an array with repeated username
      
      const response = await axios.post('http://localhost:3002/applay-stats', {
        dates,
        startTimes,
        endTimes,
        nameofjobs: nameofjobsArray,
        usernames: usernamesArray,
        companys:companysArray,
        zoomlink:zoomlinksArray
      });
     
      seterror(response.data.message);

    } catch (error) {
        if (error.response && error.response.status === 400) {
            // If the server responds with a 400 status, it means there was an error
            // Display the error message from the server
            console.error('Error:', error.response.data.error);
            // Set the error message state to display it in the UI
            seterror(error.response.data.error);
          } else {
            // Handle other types of errors (e.g., network errors)
            console.error('Error:', error);
          }
    }
  };
  const [zoomlink, setzoomlink] = useState('');


  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Interview Dates</h2>
        <form onSubmit={handleSubmit}>
          {[0, 1, 2].map(index => (
            <div key={index}>
              <label htmlFor={`date-${index}`}>Date {index + 1}:</label>
              <input type="date" id={`date-${index}`} value={dates[index]} onChange={(e) => handleDateChange(index, e.target.value)} required />
              <br />
              <label htmlFor={`start_time-${index}`}>Start Time {index + 1}:</label>
              <input type="time" id={`start_time-${index}`} value={startTimes[index]} onChange={(e) => handleStartTimeChange(index, e.target.value)} required />
              <br />
              <label htmlFor={`end_time-${index}`}>End Time {index + 1}:</label>
              <input type="time" id={`end_time-${index}`} value={endTimes[index]} onChange={(e) => handleEndTimeChange(index, e.target.value)} required />
              <br />
              
            </div>
          ))}
 <label htmlFor="Zoomlink">Zoom Link:</label>
  <textarea id="Zoomlink" value={zoomlink} onChange={(e) => setzoomlink(e.target.value)} />
  <br />
         <h7> {error}</h7>
          <button type="submit" onClick={handleSubmit} disabled={error == 'Job stats inserted successfully' }>Submit</button>
          <button onClick={onClose} disabled={error == 'All fields are required' || error == '' }>Close</button>
          
        </form>
      </div>
    </div>
  );
}

export default InterviewPopup;
