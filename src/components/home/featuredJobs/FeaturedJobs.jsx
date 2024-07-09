import  { React,useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import JobComponent from './jobcomponent';
import Jobspaid from './featuredjobfunc'; // Import the Jobspaid function
import jobimg from "../../../assets/img/dropbox.svg"
import "./FeaturedJobs.Module.css";


export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { Jobs, error } = await Jobspaid(); // Call the Jobspaid function
        console.log(Jobs);
        if (error) {
          console.error('Error fetching jobs:', error);
          return;
        }
        setJobs(Jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="FeaturedJobsContainer">
      <div className="FeaturedJobsLabel">
        <h2>
          Featured <span>Jobs</span>
        </h2>
        <Link className="jobsLink" to="/Jobs">
          Show All Jobs <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
      <div className="featuredcomponents">
        {jobs.map((job, index) => (
          <JobComponent
            key={index}
            jobDetails={{
              jobName: job.name,
              jobTime: job.jobtime,
              companyName: job.Companyname,
              jobLocation: job.location,
              jobDiscription: job.Description,
              jobCatigory: job.Majord,
            }}
          />
        ))}
      </div>
    </div>
  );
}

