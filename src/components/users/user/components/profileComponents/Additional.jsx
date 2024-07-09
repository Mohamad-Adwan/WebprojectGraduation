import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../../Contexts/User';
import { FaMobileAlt, FaRegEdit } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import axios from 'axios';
import './Aditional.Module.css'

export default function Additional({username, showOnly}) {
    const { user, setUser } = useContext(UserContext);
    const [AdditionalDetailsEdit, setAdditionalDetailsEdit] = useState(true);
    const [AdditionalDetailsShow, setAdditionalDetailsShow] = useState({
        email1: true,
        phone1: true,
        language1: true,
    })

    const [aditionalDetails, setAditionalDetails] = useState({})

    const handleAditionalDetailsChanges = (e) => {
        const { name, value } = e.target;
        setAditionalDetails({
            ...aditionalDetails,
            [name]: value,
        })
    }

    const handleCancel = () => {
        getData();
        setAdditionalDetailsEdit(true);
    }

    const handleSave = () => {
        
        setAdditionalDetailsEdit(true);
       

        axios.post(`http://localhost:3002/allinformationadd/${username}`, aditionalDetails)
            .then(response => {
                console.log('additional details uploaded successfully:', response.data);
                // Update the user state with the new values
                
            })
            .catch(error => {
                console.error('Error uploading additional details:', error);
                // Optionally, you can handle error cases
            });
    };

    const getData = () => {
        const data = axios.get(`http://localhost:3002/allinformation/${username}`)
        .then(response => {
            setAditionalDetails({
            email: response.data.results[0].email,
            phone: response.data.results[0].Phone,
            languages: response.data.results[0].Languages,
            show: response.data.results[0].detailsShow,
        })
        })
    }

    useEffect(() => {
        getData();
    },[])


    const handleCheckboxChange = (key) => {
        setAdditionalDetailsShow(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
        let showValue = '';
        if (AdditionalDetailsShow.email) showValue += 'e,';
        if (AdditionalDetailsShow.phone) showValue += 'p,';
        if (AdditionalDetailsShow.language) showValue += 'l';
        setAditionalDetails(prevState => ({
            ...prevState,
            show: showValue,
        }));
    };



    return (
        <div className='AdditionalDetails'>
            <h2>Aditional Details</h2>
            <div className='details'>
                <div className={`detailsleft ${(AdditionalDetailsEdit) && (!aditionalDetails.email) ? 'hide' : ''} `}>
                    <MdOutlineMail className='AIcon' color="#7c8493" size={25} />
                    <div className='right'>
                        <h3>Email</h3>
                        <p> {AdditionalDetailsEdit ? <p>{aditionalDetails.email}</p>
                            : <input
                                type='text'
                                className='editTextBox'
                                value={aditionalDetails.email}
                                name='email'
                                onChange={handleAditionalDetailsChanges}
                            />}</p>
                    </div>
                </div>
            </div>

            <div className='details'>
                <div className={`detailsleft ${(AdditionalDetailsEdit) && (!aditionalDetails.phone) ? 'hide' : ''} `}>
                    <FaMobileAlt className='AIcon' color="#7c8493" size={25} />
                    <div className='right'>
                        <h3>Phone</h3>
                        {AdditionalDetailsEdit ? <p>{aditionalDetails.phone}</p>
                            : <input
                                type='text'
                                className='editTextBox'
                                value={aditionalDetails.phone}
                                name='phone'
                                onChange={handleAditionalDetailsChanges}
                            />}
                    </div>
                </div>
            </div>
            <div className='details'>
                <div className={`detailsleft ${(AdditionalDetailsEdit) && (!aditionalDetails.language) ? 'hide' : ''} `}>
                    <IoLanguage className='AIcon' color="#7c8493" size={25} />
                    <div className='right'>
                        <h3>Languages</h3>
                        {AdditionalDetailsEdit ? <p>{aditionalDetails.languages}</p>
                            : <input
                                className='editTextBox'
                                type='text'
                                value={aditionalDetails.languages}
                                name='languages'
                                onChange={handleAditionalDetailsChanges}
                            />}
                    </div>
                </div>
            </div>
            {AdditionalDetailsEdit && !showOnly && <FaRegEdit className='edit' size={30} onClick={() => setAdditionalDetailsEdit(!AdditionalDetailsEdit)} />}
            {!AdditionalDetailsEdit && <div className='buttons'>
                <button onClick={handleCancel} className='cancelButton'>Cancel</button>
                <button onClick={handleSave} className='saveButton'>Save</button>
            </div>}
        </div>
    )
}
