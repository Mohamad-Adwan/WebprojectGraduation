import React,{useContext,useEffect,useState} from 'react'
import { UserContext } from '../../../../Contexts/User';
import axios from 'axios';
import "./MyApplications.Module.css";
import Interviewcomponent from './interviewcomponent'
export default function UserDashboard() {
  const { user, setUser } = useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    const fetchJobs = () => {
      console.log(user.username)
      axios.get(`http://localhost:3002/userjobs/${user.username}`)
        .then(response => {
          setJobs(response.data);
          // This might not show the updated state immediately due to closure
        })
        .catch(error => {
          console.error('Error fetching job data:', error);
        });
    };
    fetchJobs();
  }, []);
  return (
    <div className='container'>
<div className='jobs' >               
        {jobs.map((job, index) => (
          <Interviewcomponent key={index} jobDetails={{
            img: '',
            jobName: job.jobname,
            Type: job.Type==1 ? 'Accept' : 'In Review',
            companyName: job.CompanyName,
            
            
          }}inreview={job.Type==0?'In Review':1}  />
        ))}

      </div>
      </div>
  )
}
