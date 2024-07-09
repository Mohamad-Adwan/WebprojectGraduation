import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../../../../Contexts/User';
import './Experiances.Module.css'

import { FaRegEdit } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";



export default function Experiances({username, showOnly}) {

    const { user, setUser } = useContext(UserContext);

    const [experiences, setExperiences] = useState([]);
    const [experienceToAdd, setExperienceToAdd] = useState([]);
    const addNewExperiance = () => {
        setExperiences([
            ...experiences,
            {
                name: '',
                companyName: '',
                time: '',
                startDate: '',
                endDate: '',
                location: '',
                discription: '',
                image: '',
                edit: true,
            },
        ])
    }

    const handleExperianceEditChange = (index) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index].edit = !updatedExperiences[index].edit;
        setExperiences(updatedExperiences);
    };
    const handleInsertExperience = (index, ID) => {
        axios.post(`http://localhost:3002/addExperiences/${username}/${ID}`, experiences[index])
            .then(response => {
                // Handle any further actions based on the response if needed
            })
            .catch(error => {
                console.error('Error adding experience:', error);
                // Handle errors if necessary
            });
    };
    const handleExperianceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            [name]: value
        };
        setExperiences(updatedExperiences);
    };

    const handleDeleteExperiance = (indexToDelete, ID) => {
        const updatedExperiences = experiences.filter((experiance, index) => index !== indexToDelete);
        setExperiences(updatedExperiences);
        axios.delete(`http://localhost:3002/deleteExperiences/${ID}`)
            .then(response => {
                // Handle any further actions based on the response if needed
            })
            .catch(error => {
                console.error('Error adding experience:', error);
                // Handle errors if necessary
            });
    };

    //image upload
    const experianceFileInputRef = useRef(null);
    const handleExperianceImageChange = (e, index) => {
        const { name, files } = e.target;
        const updatedExperiences = [...experiences];
        const updatedExperience = {
            ...updatedExperiences[index],
            [name]: files[0] // Update the image field with the selected file
        };
        updatedExperiences[index] = updatedExperience;
        setExperiences(updatedExperiences);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        getExperiances();
    }

    const getExperiances = () => {
        const fetchExperiences = axios.get(`http://localhost:3002/experiences/${username}`)
            .then(response => {
                setExperiences(response.data.results);
            })

    }

    useEffect(() => {
       
        getExperiances();
    }, [])

    return (
        <div className='experiences'>
            <div className='header'>
                <h2>Experiences</h2>
                {!showOnly && <button onClick={addNewExperiance}>+</button>}
            </div>
            {experiences.map((experiance, index) => (
                <div className='experiance' key={index}>
                    {!experiance.edit ?
                        <div className='data'>
                            <FaBuilding size={50} />
                            <div className='rightside'>
                                <h3>{experiance.name}</h3>
                                <p><span>{experiance.companyName}</span> - {experiance.time} - {experiance.startDate} - {experiance.endDate}</p>
                                <p>{experiance.location}</p>
                                <p>{experiance.discription}</p>
                            </div>
                        </div>
                        : <form>
                            <div className="ImgContainer">
                                <FaBuilding className='image' size={50} />
                            </div>
                            <div className='data'>
                                <input
                                    type='text'
                                    value={experiance.name}
                                    placeholder='Experiance Name'
                                    name='name'
                                    onChange={(e) => handleExperianceChange(e, index)}
                                />
                                <div>
                                    <input
                                        type='text'
                                        value={experiance.companyName}
                                        placeholder='Company'
                                        name='companyName'
                                        onChange={(e) => handleExperianceChange(e, index)}
                                    />
                                    <input
                                        type='text'
                                        value={experiance.time}
                                        placeholder='Time'
                                        name='time'
                                        onChange={(e) => handleExperianceChange(e, index)}
                                    />
                                    <input
                                        type='text'
                                        value={experiance.startDate}
                                        placeholder='Start Date'
                                        name='startDate'
                                        onChange={(e) => handleExperianceChange(e, index)}
                                    />
                                    <input
                                        type='text'
                                        value={experiance.endDate}
                                        placeholder='End Date'
                                        name='endDate'
                                        onChange={(e) => handleExperianceChange(e, index)}
                                    />
                                </div>
                                <input
                                    type='text'
                                    value={experiance.location}
                                    placeholder='Location'
                                    name='location'
                                    onChange={(e) => handleExperianceChange(e, index)}
                                />
                                <textarea
                                    rows={3}
                                    value={experiance.discription}
                                    placeholder='Discription'
                                    name='discription'
                                    onChange={(e) => handleExperianceChange(e, index)}
                                />
                            </div>

                            <button className='saveButton' onClick={() => handleInsertExperience(index, experiance.ID)}>Save</button>
                            <button className='deleteButton' onClick={() => handleDeleteExperiance(index, experiance.ID)}>delete</button>
                            <button className='cancelButton' onClick={handleCancel}>Cancel</button>
                        </form>
                    }
                    {!experiance.edit && <FaRegEdit onClick={() => handleExperianceEditChange(index)} className='edit' size={30} color='#4640DE' />}
                </div>))}
        </div>
    )
}
