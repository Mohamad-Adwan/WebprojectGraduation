import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './interviewpoupee.Module.css';

function InterviewPopup({ onClose, jobname, companyname, user }) {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/interviewsuser/${jobname}/${companyname}/${user}`);
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };
  const [interviewType, setInterviewType] = useState('Online');
  const handleCloseWithId = async (id) => {
    try {
    
      const response = await axios.put(`http://localhost:3002/updateinterviewsuser/${id}`, {
        interviewType, 
        
      });
      setError(response.data.message);
      console.log(response.data.message);
      axios.delete(`http://localhost:3002/deleteinterviewsuser/${jobname}/${companyname}/${user}`);
    } catch (error) {
      console.error('Error updating interview:', error);
    }
    
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Get the date part without the time
  };
 

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Interview Details</h2>
        {interviews.length > 0 ? (
          interviews.map(interview => (
            <div key={interview.ID}>
              <p>Name of Job: {interview.Nameofjob}</p>
              <p>Date: {formatDate(interview.Date)}</p>
              <p>Start Time: {interview.StartTime}</p>
              <p>End Time: {interview.EndTime}</p>
              <p>Company: {interview.company}</p>
              <label htmlFor="interviewType">Interview Type:</label>
  <select id="interviewType" value={interviewType} onChange={(e) => setInterviewType(e.target.value)} required>
    <option value="Online">Online</option>
    <option value="Face-to-Face">Face-to-Face</option>
  </select>
              <button
                className='btnnn'
                onClick={() => handleCloseWithId(interview.ID)}
                disabled={!!error} // Disable the button if there's an error message
              >
                Booking
              </button>
              <hr />
            </div>
          ))
        ) : (
          <p>No interviews found.</p>
        )}
        {error && <p className="error-message">{error}</p>}
        <button className='btnn' onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default InterviewPopup;
