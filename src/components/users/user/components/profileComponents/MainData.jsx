import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../../Contexts/User'
import axios from 'axios';
import BackgroundImage from "../background.png"
import { IoLocationSharp } from "react-icons/io5";
import { FaRegEdit, FaRegUser } from "react-icons/fa";
import './MainData.Module.css';


export default function MainData({ username, showOnly }) {

    const { user, setUser } = useContext(UserContext);
    const [editMainData, setEditMainData] = useState(false);

    const [mainData, setMainData] = useState({
        name: 'name',
        companyName: 'companyName1',
        country: 'country',
        city: 'city',
        
    })
    const [mainData1, setMainData1] = useState({
        
        image: 'image'
    })


    const handleChangeMainData = (e) => {
        const { name, value } = e.target;
        setMainData({
            ...mainData,
            [name]: value,
        })
    }
    //image change
    const fileInputRef = useRef(null);

    const handleMainImageChange = (e) => {
        const { name, files } = e.target
        setMainData({
            ...mainData,
            [name]: files[0],
        })
    }

    const handleCancel = () => {
        getData();
        setEditMainData(false);
    }

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', mainData.name);
        formData.append('companyName', mainData.companyName);
        formData.append('country', mainData.country);
        formData.append('city', mainData.city);
        formData.append('image', mainData.image);

        axios.post(`http://localhost:3002/allinformationaddmain/${username}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('additional details uploaded successfully:', response.data);
                // Update the user state with the new values
            })
            .catch(error => {
                console.error('Error uploading additional details:', error);
                // Optionally, you can handle error cases
            });

            setEditMainData(false);
    };
    const getData = () => {
        const data = axios.get(`http://localhost:3002/allinformation/${username}`)
        .then(response => {
            setMainData({
                name: response.data.results[0].Name,
                companyName: response.data.results[0].companyname,
                country: response.data.results[0].country,
                city: response.data.results[0].city,

            })
        })

    }

    useEffect(() => {
        
        axios.get(`http://localhost:3002/profileimg/${username}`, { responseType: 'blob' }) // Set responseType to 'blob' to handle binary data
            .then(response => {
                const imageUrl = URL.createObjectURL(response.data); // Create object URL from the binary image data
                setMainData1(prevState => ({
                    ...prevState,
                    image: imageUrl,
                }));
            })
            .catch(error => {
                console.error('Error fetching profile image:', error);
            });
    }, [/*mainData.image*/])

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className=' main'>
            <div className='upside'>
                <img src={BackgroundImage} />
            </div>
            {!editMainData ?
                <div className='downside'>
                    <h2>{mainData.name}</h2>
                    {mainData.companyName && <p>work at <span>{mainData.companyName}</span></p>}
                    <div className='liveIn'>
                        <IoLocationSharp size={18} />
                        <p>{mainData.city}, {mainData.country}</p>
                    </div>
                </div> :
                <div className='downside'>
                    <input
                        className='name'
                        type='text'
                        name='name'
                        value={mainData.name}
                        onChange={handleChangeMainData}
                    />
                    <input
                        type='text'
                        name='companyName'
                        value={mainData.companyName}
                        onChange={handleChangeMainData}
                    />
                    <div className='liveIn'>
                        <input
                            type='text'
                            name='city'
                            value={mainData.city}
                            onChange={handleChangeMainData}
                        />
                        <input
                            type='text'
                            name='country'
                            value={mainData.country}
                            onChange={handleChangeMainData}
                        />
                    </div>
                    <div className='buttons'>
                        <button onClick={handleCancel} className='cancelButton'>Cancel</button>
                        <button onClick={handleSave} className='saveButton'>Save</button>
                    </div>

                </div>
            }

            {!editMainData ?
                <div className='userImg'>
                    {mainData1.image ? <img src={mainData1.image} alt='User Image' /> : <FaRegUser size={70} />}
                </div> :
                <div
                    className="ImgContainer"
                    onClick={() => fileInputRef.current.click()}
                    style={{ cursor: 'pointer' }}
                >

                    {mainData1.image ? <img src={mainData1.image} alt="image Preview" /> : <FaRegUser size={70} />}
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="imageImg"
                        name="image"
                        style={{ display: 'none' }}
                        onChange={handleMainImageChange}
                    />
                    <span className="imageHoverText">اختيار صورة</span>

                </div>
            }
            {!editMainData && !showOnly && <FaRegEdit onClick={() => setEditMainData(!editMainData)} className='edit' size={30} color='#4640DE' />}
        </div>
    )
}
