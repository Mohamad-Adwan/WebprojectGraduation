import React,{ useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../../../../Contexts/User';
import './Education.Module.css';

import { FaRegEdit, FaUniversity } from "react-icons/fa";

export default function Education({username, showOnly}) {

    const { user, setUser } = useContext(UserContext);

    const [educations, setEducations] = useState([]);
    const addNewEducation = () => {
        setEducations([
            ...educations,
            {
                name: '',
                major: '',
                year: '',
                discription: '',
                image: '',
                edit: true,
            }
        ])
    }
    const handleInsertEducation = ( index, ID) => {
        axios.post(`http://localhost:3002/addEducations/${username}/${ID}`, educations[index])
            .then(response => {
                // Handle any further actions based on the response if needed
            })
            .catch(error => {
                console.error('Error adding educations:', error);
                // Handle errors if necessary
            });
    };
    const handleEducationChange = (e, index) => {
        const { name, value } = e.target;
        const updatedEducations = [...educations];
        updatedEducations[index] = {
            ...updatedEducations[index],
            [name]: value
        };
        setEducations(updatedEducations);
    }

    const handleEducationEditChange = (index) => {
        const updatedEducations = [...educations];
        updatedEducations[index].edit = !updatedEducations[index].edit;
        setEducations(updatedEducations);
    }

    const handleDeleteEducation = (indexToDelete, ID) => {
        const updatedEducations = educations.filter((education, index) => index !== indexToDelete);
        setEducations(updatedEducations);
        axios.delete(`http://localhost:3002/deleteEducations/${ID}`,)
            .then(response => {
                console.log(response.data.message); // Log the message from the server
                // Handle any further actions based on the response if needed
            })
            .catch(error => {
                console.error('Error adding experience:', error);
                // Handle errors if necessary
            });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        getEducations();
    }

    //image upload
    const educationFileInputRef = useRef(null);
    const handleEducationImageChange = (e, index) => {
        const { name, files } = e.target;
        const updatedEducations = [...educations];
        updatedEducations[index][name] = files[0];
        setEducations(updatedEducations);
    };

    const getEducations = () => {
        const fetchEducation = axios.get(`http://localhost:3002/educations/${username}`)
        .then(response => {
            setEducations(response.data.results);
        })
    }

    useEffect(() => {
        getEducations();
    },[])

  return (
    <div className='educations'>
                        <div className='header'>
                            <h2>Educations</h2>
                            {!showOnly && <button onClick={addNewEducation}>+</button>}
                        </div>
                        {educations.map((education, index) => (
                            <div className='education' key={index}>
                                {!education.edit ?
                                    <div className='data'>
                                        <FaUniversity className='image' size={50} />
                                        <div className='rightSide'>
                                            <h3>{education.name}</h3>
                                            <p>{education.major}</p>
                                            <p>{education.year}</p>
                                            <p>{education.discription}</p>
                                        </div>
                                    </div>
                                    : <form>
                                        <div className="ImgContainer">
                                        <FaUniversity size={50} />
                                        </div>
                                        <div className='data'>
                                            <input
                                                type='text'
                                                name='name'
                                                placeholder='University Name'
                                                value={education.name}
                                                onChange={(e) => handleEducationChange(e, index)}
                                            />
                                            <input
                                                type='text'
                                                name='major'
                                                placeholder='Major'
                                                value={education.major}
                                                onChange={(e) => handleEducationChange(e, index)}
                                            />
                                            <input
                                                type='text'
                                                name='year'
                                                placeholder='Years'
                                                value={education.year}
                                                onChange={(e) => handleEducationChange(e, index)}
                                            />
                                            <textarea
                                                type='text'
                                                name='discription'
                                                placeholder='Discription'
                                                value={education.discription}
                                                onChange={(e) => handleEducationChange(e, index)}
                                            />
                                        </div>
                                        <button className='saveButton' onClick={() => handleInsertEducation( index, education.ID)}>Save</button>
                                        <button className='deleteButton' onClick={() => handleDeleteEducation( index, education.ID)}>delete</button>
                                        <button className='cancelButton' onClick={handleCancel}>Cancel</button>
                                    </form>
                                }
                                {!education.edit && !showOnly && <FaRegEdit onClick={() => handleEducationEditChange(index)} size={30} color='#4640DE' />}
                            </div>
                        ))}
                    </div>
  )
}
