import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CompanyJobs.Module.css';
import JobComponent from '../../../home/featuredJobs/jobcomponent';
import { Link } from 'react-router-dom';

export default function companyJobs({ username, showOnly }) {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = () => {
            console.log(username)
            axios.get(`http://localhost:3002/jobsComp/${username}`)
                .then(response => {
                    setJobs(response.data);
                    console.log(response.data); // This might not show the updated state immediately due to closure
                })
                .catch(error => {
                    console.error('Error fetching job data:', error);
                });
        };
        fetchJobs();
    }, []);

    return (
        <div className='companyJobs'>
            <h3>Jobs</h3>
            <div className='jobs'>
                {showOnly ? 
                jobs.map((job, index) => (
                    <JobComponent key={index} jobDetails={{
                        img: '',
                        jobName: job.Nameofjobs,
                        jobTime: job.jobtime,
                        companyName: job.CompanyName,
                        jobLocation: job.Location,
                        jobDiscription: job.Description,
                        jobCatigory: job.Majored,
                    }} />
                ))
                :jobs.map((job, index) => (
                    <Link to={`Job/${job.ID}/${job.Nameofjobs}`}><JobComponent key={index} jobDetails={{
                        img: '',
                        jobName: job.Nameofjobs,
                        jobTime: job.jobtime,
                        companyName: job.CompanyName,
                        jobLocation: job.Location,
                        jobDiscription: job.Description,
                        jobCatigory: job.Majored,
                    }} isCompany={true} /></Link>
                ))}
            </div>
        </div>
    )
}
