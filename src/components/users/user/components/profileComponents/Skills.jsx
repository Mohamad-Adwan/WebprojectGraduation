import axios from 'axios';
import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../../Contexts/User'
import { FaMobileAlt, FaRegEdit, FaUniversity, FaRegUser } from "react-icons/fa";
import './skills.Module.css'
export default function Skills({ username, showOnly }) {

    //const { user, setUser } = useContext(UserContext);
    const [editSkills, setEditSkills] = useState(false);
    const [skills, setSkills] = useState([])
    // useEffect(() => {
    //     setSkills([
    //         { name: Skill1 },
    //         { name: Skill2 }
    //     ]);
    // }, [Skill1, Skill2]);

    const handleSkillChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSkills = [...skills];
        updatedSkills[index] = {
            ...updatedSkills[index],
            [name]: value
        };
        setSkills(updatedSkills);
    };

    const handleSkillEditChange = (index) => {
        const updatedSkills = [...skills];
        updatedSkills[index].edit = !updatedSkills[index].edit;
        setSkills(updatedSkills);
    };

    const handleDeleteSkill = (indexToDelete) => {
        const updatedSkills = skills.filter((skill, index) => index !== indexToDelete);
        setSkills(updatedSkills);
        // Convert skills array to a comma-separated string
        const skillsString = skills.map(skill => skill.name).join(',');

        // Send skills data to the backend
        axios.post(`http://localhost:3002/upload-skills/${username}`, { skills: skillsString })
            .then(response => {
                console.log('Skills uploaded successfully:', response.data);
                // Optionally, you can handle any additional logic after successful upload
            })
            .catch(error => {
                console.error('Error uploading skills:', error);
                // Optionally, you can handle error cases
            });
    };

    const addNewSkill = () => {
        setSkills([
            ...skills,
            {
                name: '',
                edit: true,
            }
        ]);
        setEditSkills(true);
    };

    const handleSave = () => {
        // Convert skills array to a comma-separated string
        const skillsString = skills.map(skill => skill.name).join(',');

        // Send skills data to the backend
        axios.post(`http://localhost:3002/upload-skills/${username}`, { skills: skillsString })
            .then(response => {
                console.log('Skills uploaded successfully:', response.data);
                // Optionally, you can handle any additional logic after successful upload
            })
            .catch(error => {
                console.error('Error uploading skills:', error);
                // Optionally, you can handle error cases
            });
        setEditSkills(false);
    };

    const handleCancel = () => {
        getSkills();
        setEditSkills(false);
    }

    const getSkills = () => {
        axios.get(`http://localhost:3002/allinformation/${username}`)
            .then(response => {
                const skillsData = response.data.results[0].Skills;
                if (skillsData) {
                    setSkills(skillsData.split(',').map(word => ({ name: word.trim(), edit: true })));
                } else {
                    // Handle case where no skills data is available
                    console.error('No skills data found');
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching skills:', error);
            });
    };

    useEffect(() => {
        getSkills();
    }, [])

    return (
        <div className='skills'>
            <div className='header'>
                <h2>Skills</h2>
                <div className='buttons'>
                    {!showOnly && <button onClick={addNewSkill}>+</button>}
                    {!editSkills && !showOnly && <FaRegEdit onClick={() => setEditSkills(!editSkills)} className='edit' size={30} color='#4640DE' />}
                </div>
            </div>
            <div className='skillsContainer'>
                {skills.map((skill, index) => (
                    <div className='skill' key={index}>
                        {!editSkills ? <p>{skill.name}</p>
                            : <div>
                                <input
                                    type='text'
                                    value={skill.name}
                                    name='name'
                                    onChange={(e) => handleSkillChange(e, index)}
                                />
                                <button onClick={() => handleDeleteSkill(index)}>X</button>
                            </div>
                        }
                    </div>

                ))}
            </div>
            {editSkills && <div className='buttons'>
                <button className='saveButton' onClick={handleSave}>Save</button>
                <button className='cancelbutton' onClick={handleCancel}>Cancel</button>
            </div>}
        </div>
    )
}
