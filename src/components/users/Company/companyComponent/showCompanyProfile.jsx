import React, { useContext, useState, useRef, useEffect } from 'react'
import './ShowCompanyProfile.Module.css';
import { UserContext } from '../../../../Contexts/User';
import SocialLinks from '../../user/components/profileComponents/SocialLinks';
import AboutMe from '../../user/components/profileComponents/AboutMe';
import AdditionalDetails from '../../user/components/profileComponents/Additional';
import MainData from '../../user/components/profileComponents/MainData';
import Skills from '../../user/components/profileComponents/Skills';
import CompanyJobs from './companyJobs';
import { useParams } from 'react-router-dom';

export default function showCompanyProfile() {
    const {companyname} = useParams('companyname');
  return (
    <div className='showCompanyProfile'>
      <header>
        <h1>{companyname} Profile</h1>
      </header>
      <div className='userdata'>
                <div className='largeContainer'>
                    <MainData username={companyname} showOnly={true}/>
                    <AboutMe username={companyname} showOnly={true}/>
                    <Skills username={companyname} showOnly={true}/>
                    <CompanyJobs username={companyname} showOnly={true}/>
                </div>
                <div className='smallContainer'>
                    <AdditionalDetails username={companyname} showOnly={true}/>
                    <SocialLinks username={companyname} showOnly={true}/>
                </div>
            </div>
    </div>
  )
}
