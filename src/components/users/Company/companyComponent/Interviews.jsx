import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interviews.Module.css';

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

  const handleDelete = async (id,username,company, description) => {
    try {
      await axios.put(`http://localhost:3002/interviewsreject/${id}`, { description });
      // Remove the deleted interview from the state
      const notificationData = {
        username: username,
        description: `you got not approved for get the job`,
        company: company
      };
      await axios.post('http://localhost:3002/notification', notificationData);
      console.log('not approved successfully');

    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };
  const handleDeletefromint = async (id) => {
    try {
      await axios.put(`http://localhost:3002/interviewsDeleteuser/${id}`);
      // Remove the deleted interview from the state
     
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };


  const handleAccept = async (id,username,company, description) => {
    try {
      await axios.put(`http://localhost:3002/interviewsaccept/${id}`, { description });
      //////////
      const notificationData = {
        username: username,
        description: `you got approved for the job`,
        company: company
      };
      await axios.post('http://localhost:3002/notification', notificationData);
      console.log('approved successfully');

      //////////
      // Remove the deleted interview from the state
    } catch (error) {
      console.error('Error accepting interview:', error);
    }
  };

  const handleDescriptionChange = (event, index) => {
    const updatedInterviews = [...interviews];
    updatedInterviews[index].Description = event.target.value;
    setInterviews(updatedInterviews);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Get the date part without the time
  };
  return (
    <div>
      <h2>Interviews</h2>
      <table>
        <thead>
          <tr>
            
            <th>Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>The Condition</th>
            <th className='zoomlink'>Type Interview</th>
            <th>Description</th>
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
              <td>{interview.Accepted=='0'?'Not reviwd':(interview.Accepted=='1'?'accepted':'Reject')}</td>
              <td>
  {interview.typeofmeet === 'Face-to-Face' ? (
    'Face to Face'
  ) : (
    interview.zoomlink
  )}
</td>
              <td>
                {(interview.Accepted == '1' ||interview.Accepted == '2')?interview.Description:(<input 
                  type="text" 
                  value={interview.Description} 
                  onChange={(event) => handleDescriptionChange(event, index)} 
                />) }
                
              </td>
              <td> {interview.Accepted ? (
    <button onClick={() => handleDeletefromint(interview.ID)}>Delete</button>
  ) : (
    <>
      <button onClick={() => handleDelete(interview.ID, interview.username, interview.company, interview.Description)}>Delete</button>
      <button className='s' onClick={() => handleAccept(interview.ID, interview.username, interview.company, interview.Description)}>Accept</button>
    </>
  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewPage;
