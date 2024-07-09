import React, { useContext, useState, useRef, useEffect } from 'react'
import './CompanyProfile.Module.css';
import { UserContext } from '../../../../Contexts/User';
import SocialLinks from '../../user/components/profileComponents/SocialLinks';
import AboutMe from '../../user/components/profileComponents/AboutMe';
import AdditionalDetails from '../../user/components/profileComponents/Additional';
import MainData from '../../user/components/profileComponents/MainData';
import Skills from '../../user/components/profileComponents/Skills';
import CompanyJobs from './companyJobs';

export default function CompanyProfile() {

  const { user, setUser } = useContext(UserContext);
    console.log(user)
    if (!user) {
        // إرجاع رسالة تعبيرية أو إعادة توجيه المستخدم إذا كانت القيمة غير متاحة
        return <div>Loading...</div>;
    }

  return (
    <div className='CompanyProfilePage'>
      <header>
        <h1>Profile</h1>
      </header>
      <div className='userdata'>
                <div className='largeContainer'>
                    <MainData username={user.username}/>
                    <AboutMe username={user.username}/>
                    <Skills username={user.username}/>
                    <CompanyJobs username={user.username}/>
                </div>
                <div className='smallContainer'>
                    <AdditionalDetails username={user.username}/>
                    <SocialLinks username={user.username}/>
                </div>
            </div>
    </div>
  )
}
