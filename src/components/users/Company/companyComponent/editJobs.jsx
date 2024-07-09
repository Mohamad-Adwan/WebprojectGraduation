import { React, useEffect, useContext, useState } from 'react';
import './EditJobs.Module.css';
import JobComponent from '../../../home/featuredJobs/jobcomponent'
import axios from 'axios';
import { UserContext } from '../../../../Contexts/User';
import { Link } from 'react-router-dom';

export default function EditJobs() {
  const [jobs, setJobs] = useState([]);
  const { user, setUser } = useContext(UserContext);
  if (!user) {
    return <p>loading...</p>
  }

  useEffect(() => {
    const fetchJobs = () => {
      console.log(user.username)
      axios.get(`http://localhost:3002/jobsComp/${user.username}`)
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
    <div className='editJobs'>
      <header>
        <h1>Jobs</h1>
      </header>
      <div className='jobs'>
        {//here is change 20022${job.Description}
         }
        
        {jobs.map((job, index) => (
          <Link to={`Job/${job.ID}/${job.Nameofjobs}/${job.Description}/${job.Location}`}><JobComponent key={index} jobDetails={{
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
