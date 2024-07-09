import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import './UserComponent.Module.css'

export default function userComponent({userData}) {

    

  return (
    <div className='userComponent'>
        <div className='side'>
        <div className='imageDiv'>
        {userData.image ? <img className='image' src={userData.image} /> : <FaRegUser className='image'/>}
        </div>
        <h3>{userData.username}</h3>
        </div>
        <div className='side'>
        <p>{userData.email}</p>
        <p className='type'>{userData.isPaid=='1' ? 'Paid' : 'Free'}</p>
        </div>
    </div>
  )
}
