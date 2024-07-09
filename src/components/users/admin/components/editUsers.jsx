import React, { useState, useEffect } from 'react';
import './EditUser.Module.css';
import { IoSearchSharp } from "react-icons/io5";
import UserComponent from './userComponent';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function EditUsers() {
  const [userData, setUserData] = useState([]); // Initialize state for user data as an empty array
  const [searchQuery, setSearchQuery] = useState(''); // Initialize state for search query

  useEffect(() => {
    // Define an async function to fetch data
    const fetchData = async () => {
      try {
        // Fetch data from the endpoint
        const response = await axios.get('http://localhost:3002/adminuser');
        // Set the fetched user data to the state
        setUserData(response.data); // Assuming 'data' is the key containing the user data array
      } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
      }
    };

    // Call the async function when the component mounts
    fetchData();

  }, []);

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter user data based on search query
  const filteredUserData = userData.filter(user => {
    const usernameMatch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return usernameMatch || emailMatch;
  });

  return (
    <div className='addUserPage'>
      <header>
        <h1>Users</h1>
      </header>
      <div className='searchDiv'>
        <input 
          type='text'
          placeholder='Search'
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <IoSearchSharp />
      </div>
      <div className='usersDiv'>
        {filteredUserData.map((user, index) => (
          <Link key={index} to={`/AdminControl/EditUser/${user.username}`}>
            <UserComponent userData={user}/>
          </Link>
        ))}
      </div>
    </div>
  );
}
