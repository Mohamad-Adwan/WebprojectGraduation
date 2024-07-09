import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditeControlt from './editeControl';
import { Link, useParams } from 'react-router-dom';
import './ControlofEdit.Module.css';

//import './ControlofEdit.Module.css'
const ControlofEdit = () => {
    const [accepteedite, setaccepteedite] = useState([]);

    useEffect(() => {
    
        fetchLoginStats();
  }, []);

  const fetchLoginStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/accepteedite', {
         }
    );
    setaccepteedite(response.data);
    } catch (error) {
      console.error('Error fetching Login stats:', error);
    }
  };
  const handleAccept =(username,city,country,name)=>

    {
      
  axios.post(`http://localhost:3002/acceptediteadmin/${username}/${city}/${country}/${name}`) .then(response => {
})
}
  const handleReject =(username)=>
    {
      
      axios.delete(`http://localhost:3002/deleteedtiadmin/${username}`) .then(response => {
  })
}
  

  return (
    <div className='jobManage'>
      <span className='title'>Editing Requests</span>
    <div className='Applications'>
    {<div className='Applicants'>
  
    {accepteedite.map((user, index) => (
      <div className="user" key={index}>
    <Link key={index} to={`/user/${user.username}`}>
      <EditeControlt userData={{
        image: '',
        username: user.username,
        city: 'City : '+user.city ,
        country :'  Country : '+user.country,
        Name: user.Name
        
      }} />
        </Link>
      <div className='buttons'>
                <button className='accept'onClick={() => handleAccept( user.username,user.city,user.country,user.Name)}>Accept</button>
                <button className='reject'onClick={() => handleReject( user.username)}>reject</button>
  
              </div>
  
              </div>
  ))}
 
  </div>}
  </div>
  </div>
);
};

export default ControlofEdit;
