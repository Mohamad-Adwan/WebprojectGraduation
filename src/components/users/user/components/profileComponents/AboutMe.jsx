import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../../Contexts/User'
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import './AboutMe.Module.css'

export default function AboutMe({username, showOnly}) {
    const { user, setUser } = useContext(UserContext);
    const [editAboutMe, setEditAboutMe] = useState(false);
    const [aboutMe, setAboutMe] = useState('');

    const handleCancel = () => {
        getAboutMe();
        setEditAboutMe(false);
    }

    const handleSave = () => {
        //رفع للداتابيس
        axios.post(`http://localhost:3002/allinformation/${username}/${aboutMe}`)
        .then(response => {
            console.log('social uploaded successfully:', response.data);
            // Optionally, you can handle any additional logic after successful upload
        })
        .catch(error => {
            console.error('Error uploading social:', error);
            // Optionally, you can handle error cases
        });
        setEditAboutMe(false);
    }

    const getAboutMe = () => {
        const fetchInfo = axios.get(`http://localhost:3002/allinformation/${username}`)
            .then(response => {
                setAboutMe(response.data.results[0].Bio)
            })
    }

    useEffect(() => {
        getAboutMe();
    }, []);

    return (
        <div className='aboutMe'>
            <div className='aboutMeHeader'>
                <h2>About Me</h2>
                {!editAboutMe && !showOnly && <FaRegEdit className='edit' size={30} color='#4640DE' onClick={() => setEditAboutMe(!editAboutMe)} />}
            </div>
            {!editAboutMe ? <p>{aboutMe}</p>
                : <div className='editDiv'>
                    <textarea
                        rows={6}
                        type='textarea'
                        value={aboutMe}
                        name='aboutMe'
                        onChange={(e) => { setAboutMe(e.target.value) }}
                    />
                    <div className='buttons'>
                        <button onClick={handleCancel} className='cancelButton'>Cancel</button>
                        <button onClick={handleSave} className='saveButton'>Save</button>
                    </div>
                </div>
            }
        </div>
    )
}