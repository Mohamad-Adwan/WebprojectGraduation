import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import './interviewcomponent.Module.css';
import { FaCompassDrafting, FaBullhorn, FaMoneyBills, FaChartLine, FaDesktop, FaCode, FaUsers, FaBriefcase, FaRegFilePdf, FaFilePdf } from "react-icons/fa6";
import { SiLibreofficewriter } from "react-icons/si";
import { UserContext } from '../../../../Contexts/User';
import InterviewPopup from './interviewpoupe';

export default function InterviewComponent({ jobDetails, inreview }) {
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [isTypeOne, setIsTypeOne] = useState(false);
    const [isAcceptedOne, setIsAcceptedOne] = useState(false);
    const { user } = useContext(UserContext);

    const handelInterview = () => {
        setSelectedInterview(true);
    };

    const handelDelete = () => {
       if( inreview === 'In Review'){
        axios.delete(`http://localhost:3002/userdeleteappfrompdffile/${jobDetails.jobName}/${jobDetails.companyName}/${user.username}`);
       }

    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/interviewsuser/${jobDetails.jobName}/${jobDetails.companyName}/${user.username}`);
                const interviews = response.data;

                const hasTypeOne = interviews.some(interview => interview.Type === 1);
                const hasAcceptedOne = interviews.some(interview => interview.Accepted === 1);

                setIsTypeOne(hasTypeOne);
                setIsAcceptedOne(hasAcceptedOne);

               // console.log(response.data);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchData();
    }, [jobDetails.jobName, jobDetails.companyName, user.username]);

    const handleClosePopup = () => {
        setSelectedInterview(null);
    };

    return (
        <div className="jobcomponent">
            <div className="jobDiv">
                {jobDetails.jobCatigory ? (
                    jobDetails.jobCatigory === 'Design' && <FaCompassDrafting className="image" /> ||
                    jobDetails.jobCatigory === 'Sales' && <FaChartLine className="image" /> ||
                    jobDetails.jobCatigory === 'Marketing' && <FaBullhorn className="image" /> ||
                    jobDetails.jobCatigory === 'Finance' && <FaMoneyBills className="image" /> ||
                    jobDetails.jobCatigory === 'Technology' && <FaDesktop className="image" /> ||
                    jobDetails.jobCatigory === 'Engineering' && <FaCode className="image" /> ||
                    jobDetails.jobCatigory === 'Developer' && <FaCode className="image" /> ||
                    jobDetails.jobCatigory === 'Business' && <FaBriefcase className="image" /> ||
                    jobDetails.jobCatigory === 'Human Resources' && <FaUsers className="image" /> ||
                    <SiLibreofficewriter className="image" />
                ) : <SiLibreofficewriter className="image" />}
                <div className="label">
                    <h3>{jobDetails.jobName}</h3>
                    <div>
                        <p className="companyName">{jobDetails.companyName}</p>
                    </div>
                </div>
                <p className="jobTime">{jobDetails.Type}</p>
                {isAcceptedOne ? (
                    <h4>Review results in interview</h4>
                ) : (
                    isTypeOne ? (
                        <h4>Review the interview checklist</h4>
                    ) : (
                        inreview === 'In Review' ? (
                            <h4>*In Review</h4>
                        ) : (
                            <button className='bu' onClick={handelInterview}>Interview Date</button>
                        )
                    )
                )}
                { inreview === 'In Review' ? (<button className='bu' onClick={handelDelete}>Delete</button> ) : ('')}
                
                {selectedInterview && (
                    <InterviewPopup 
                        onClose={handleClosePopup} 
                        jobname={jobDetails.jobName} 
                        companyname={jobDetails.companyName} 
                        user={user.username} 
                    />
                )}
            </div>
        </div>
    );
}
