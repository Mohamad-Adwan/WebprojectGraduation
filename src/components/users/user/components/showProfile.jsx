import React, { useContext, useState, useRef, useEffect } from 'react'
import "./ShowProfile.Module.css"
import Experiances from './profileComponents/Experiances';
import Education from './profileComponents/Education';
import Skills from './profileComponents/Skills';
import SocialLinks from './profileComponents/SocialLinks';
import AboutMe from './profileComponents/AboutMe';
import AdditionalDetails from './profileComponents/Additional';
import MainData from './profileComponents/MainData';
import GenerateCv from './profileComponents/GenerateCv';
import { useParams } from 'react-router-dom';

export default function showProfile() {

    const { username } = useParams('username');
    if (!username) {
        // إرجاع رسالة تعبيرية أو إعادة توجيه المستخدم إذا كانت القيمة غير متاحة
        return <div>Loading...</div>;
    }

    return (
        <div className='showProfilePage'>
            <header>
                <h1>{username} Profile</h1>
            </header>
            <div className='userdata'>
                <div className='largeContainer'>
                    <MainData username={username} showOnly={true}/>
                    <AboutMe username={username} showOnly={true}/>
                    <Experiances username={username} showOnly={true}/>
                    <Education username={username} showOnly={true}/>
                    <Skills username={username} showOnly={true}/>
                </div>
                <div className='smallContainer'>
                    <AdditionalDetails username={username} showOnly={true}/>
                    <SocialLinks username={username} showOnly={true}/>
                    <GenerateCv username={username} showOnly={true} />
                </div>
            </div>
        </div>
    )
}