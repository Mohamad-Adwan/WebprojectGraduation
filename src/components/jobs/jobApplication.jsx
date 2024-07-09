import React from 'react';
import './JobApplication.Module.css';
import { useParams } from 'react-router-dom';

export default function jobApplication() {
    const { id } = useParams('id');
  return (
    <div className='jobApplication'>{id}</div>
  )
}
