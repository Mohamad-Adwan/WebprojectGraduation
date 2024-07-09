import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../../../Contexts/User'
import { FaBuilding } from "react-icons/fa6";
import { IoLanguage, IoLocationSharp } from "react-icons/io5";
import { FaMobileAlt, FaRegEdit, FaUniversity, FaRegUser } from "react-icons/fa";
import { FiTwitter, FiGlobe } from "react-icons/fi";
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { LiaLinkedin } from "react-icons/lia";
import { MdOutlineMail } from "react-icons/md";
import "./UserProfile.Module.css"
import BackgroundImage from "./background.png"
import axios from 'axios';
import Experiances from './profileComponents/Experiances';
import Education from './profileComponents/Education';
import Skills from './profileComponents/Skills';
import SocialLinks from './profileComponents/SocialLinks';
import AboutMe from './profileComponents/AboutMe';
import AdditionalDetails from './profileComponents/Additional';
import MainData from './profileComponents/MainData';
import GenerateCv from './profileComponents/GenerateCv';

export default function UserProfile() {



    const { user, setUser } = useContext(UserContext);
    console.log(user)
    if (!user) {
        // إرجاع رسالة تعبيرية أو إعادة توجيه المستخدم إذا كانت القيمة غير متاحة
        return <div>Loading...</div>;
    }

    return (
        <div className='userProfilePage'>
            <header>
                <h1>My Profile</h1>
            </header>
            <div className='userdata'>
                <div className='largeContainer'>
                    <MainData username={user.username}/>
                    <AboutMe username={user.username}/>
                    <Experiances username={user.username}/>
                    <Education username={user.username}/>
                    <Skills username={user.username}/>
                </div>
                <div className='smallContainer'>
                    <AdditionalDetails username={user.username}/>
                    <SocialLinks username={user.username}/>
                    <GenerateCv username={user.username} />
                </div>
            </div>
        </div>
    )
}