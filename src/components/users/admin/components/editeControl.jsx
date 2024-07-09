import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import './editeControl.Module.css'

export default function editeControl({userData}) {

    

  return (
    <div className='userComponent'>
        <div className='side'>
        <div className='imageDiv'>
        {userData.image ? <img className='image' src={userData.image} /> : <FaRegUser className='image'/>}
        </div>
        <h3>{userData.username}</h3>
        </div>
        <div className='side'>
        <p>{userData.city}</p>
        <p>{userData.country}</p>
        <p className='type'>{userData.Name}</p>
        </div>
    </div>
  )
}
