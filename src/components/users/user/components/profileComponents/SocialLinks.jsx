import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../../Contexts/User'
import './SocialLinks.Module.css'
import { FiTwitter, FiGlobe } from "react-icons/fi";
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { LiaLinkedin } from "react-icons/lia";
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';

export default function SocialLinks({username,showOnly}) {

    //const { user, setUser } = useContext(UserContext);

    const [editSocial, setEditSocial] = useState(false);
    const [social, setSocial] = useState([])
    const [selectOpen, setSelectOpen] = useState(false);
    const handleSocialChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSocial = [...social];
        updatedSocial[index][name] = value;
        setSocial(updatedSocial);
    };

    const toggleShow = (index) => {
        const updatedSocial = [...social];
        updatedSocial[index].show = !updatedSocial[index].show;
        setSocial(updatedSocial);
    };

    const handleAddLink = () => {
        setEditSocial(true);
        setSocial([
            ...social,
            {
                name: 'Website',
                data: '',
            }
        ])
    }

    const handleDeleteLink = (indexToDelete) => {
        const updatedSocial = [...social.slice(0, indexToDelete), ...social.slice(indexToDelete + 1)];
        setSocial(updatedSocial);
        
        axios.post(`http://localhost:3002/upload-Social/${username}`, { socials: updatedSocial })
        .then(response => {
            console.log('social uploaded successfully:', response.data);
            // Optionally, you can handle any additional logic after successful upload
        })
        .catch(error => {
            console.error('Error uploading social:', error);
            // Optionally, you can handle error cases
        });
        setEditSocial(false);
    };

    const handleCancel = () => {
        getSocial();
        setEditSocial(false);
    }

    const handleSave = () => {
        //ارفع string على الداتابيس في social
        const SocialString = social.map(item => `${item.name},${item.data}`).join(',');
        axios.post(`http://localhost:3002/upload-Social/${username}`, { socials: SocialString })
        .then(response => {
            console.log('social uploaded successfully:', response.data);
            // Optionally, you can handle any additional logic after successful upload
        })
        .catch(error => {
            console.error('Error uploading social:', error);
            // Optionally, you can handle error cases
        });
        setEditSocial(false);
    }

    const getSocial = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/allinformation/${username}`);
            const socialArray = response.data.results[0].Social.split(',');
            
            const socialObjects = [];
            for (let i = 0; i < socialArray.length; i += 2) {
                const name = socialArray[i];
                const data = socialArray[i + 1];
                socialObjects.push({ name, data });
            }
            
            setSocial(socialObjects);
        } catch (error) {
            console.error('Error fetching social information:', error);
            // Optionally, you can handle error cases
        }
    };
    useEffect(() => {
        getSocial();
    }, [])

    return (
        <div className='social'>
            <div className='header'>
                <h3>Social Links</h3>
                <div className='buttons'>
                    {!editSocial && !showOnly && <FaRegEdit onClick={() => setEditSocial(!editSocial)} className='edit' size={30} color='4640DE' />}
                    {!showOnly && <button onClick={handleAddLink} className='addButton'>+</button>}
                </div>
            </div>
            <div className='Links'>
                {social.map((link, index) => (
                    <div className={`link ${(!editSocial) && (!link.data) ? 'hide' : ''}`} key={index}>
                        <div className='data'>
                            {link.name == 'Facebook' && <AiOutlineFacebook color='7C8493' size={30} /> ||
                                link.name == 'Instagram' && <AiOutlineInstagram color='7C8493' size={30} /> ||
                                link.name == 'Twitter' && <FiTwitter color='7C8493' size={30} /> ||
                                link.name == 'Linkedin' && <LiaLinkedin color='7C8493' size={30} /> ||
                                link.name == 'Website' && <FiGlobe color='7C8493' size={30} />}
                            {!editSocial ? <div className='right'>
                                <h4>{link.name}</h4>
                                <a href={`https://${link.data}`}>{link.data}</a>
                            </div> :
                                <div className='right'>
                                    <select
                                        value={link.name}
                                        name='name'
                                        onClick={() => setSelectOpen(!selectOpen)}
                                        onChange={(e) => handleSocialChange(e, index)}
                                    >
                                        <option value="Facebook">Facebook</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Linkedin">Linkedin</option>
                                        <option value="Website">Website</option>
                                    </select>
                                    <input
                                        type='text'
                                        name='data'
                                        value={link.data}
                                        onChange={(e) => handleSocialChange(e, index)}
                                    />
                                </div>}
                        </div>
                        <div className='editButtons'>
                            {editSocial && <button onClick={() => handleDeleteLink(index)} className='deleteButton'>Delete</button>}
                        </div>
                    </div>
                ))}
            </div>
            {editSocial && <div className='buttons'>
                <button onClick={handleSave} className='saveButton'>Save</button>
                <button onClick={handleCancel} className='cancelButton'>Cancel</button>
            </div>}
        </div>
    )
}
