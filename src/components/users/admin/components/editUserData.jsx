import React from 'react'
import { useParams } from 'react-router-dom';
import MainData from '../../user/components/profileComponents/MainData';
import AboutMe from '../../user/components/profileComponents/AboutMe';
import Experiances from '../../user/components/profileComponents/Experiances';
import Education from '../../user/components/profileComponents/Education';
import Skills from '../../user/components/profileComponents/Skills';
import AdditionalDetails from '../../user/components/profileComponents/Additional';
import SocialLinks from '../../user/components/profileComponents/SocialLinks';

export default function editUserData() {
    const { username } = useParams('username');
    if (!username) {
        // إرجاع رسالة تعبيرية أو إعادة توجيه المستخدم إذا كانت القيمة غير متاحة
        return <div>Loading...</div>;
    }

    return (
        <div className='userProfilePage'>
            <header>
                <h1>Edit {username} Data</h1>
            </header>
            <div className='userdata'>
                <div className='largeContainer'>
                    <MainData username={username} />
                    <AboutMe username={username}/>
                    <Experiances username={username}/>
                    <Education username={username}/>
                    <Skills username={username}/>
                </div>
                <div className='smallContainer'>
                    <AdditionalDetails />
                    <SocialLinks />
                </div>
            </div>
        </div>
    )
}
