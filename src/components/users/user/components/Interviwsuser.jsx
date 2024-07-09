import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interviwsuser.Module.css';

function InterviewPage() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    // Fetch interview data from your backend API when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleDelete = async (id, description) => {
    try {
      await axios.delete(`http://localhost:3002/interviewsDeleteuser/${id}`);
      // Remove the deleted interview from the state
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Get the date part without the time
  };

  

  return (
    <div>
      <h2 className='h2' >Interviews</h2>
      <table className='table'>
        <thead>
          <tr>
            
            <th>Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th className='zoomlink'>Description</th>
            <th className='zoomlink'>Type Interview</th>
            <th>Results</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, index) => (
            <tr key={interview.ID}>
              <td>{interview.username}</td>
              <td>{formatDate(interview.Date)}</td>
              <td>{interview.StartTime}</td>
              <td>{interview.EndTime}</td>
              <td>{interview.Description}</td>
              <td>
  {interview.typeofmeet === 'Face-to-Face' ? (
    'Face to Face'
  ) : (
    interview.zoomlink
  )}
</td>
              <td>{interview.Accepted==2?"Not Accepted":(interview.Accepted==1?"Accepted":"In Review")}</td>
              <td>
                <button className='button' onClick={() => handleDelete(interview.ID)}>Delete</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewPage;
