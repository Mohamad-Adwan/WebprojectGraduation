import React, { useState,useContext ,useEffect} from 'react';
import './JobManage.Module.css';
import UserComponent from '../../admin/components/userComponent';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../../../Contexts/User';
import { saveAs } from 'file-saver';
import InterviewPopup from './InterviewPopup';

export default function JobManage() {
  const [showPopup, setShowPopup] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const { id,Nameofjobs,Description,Location } = useParams();
  
  const [JobPdf, setPdf] = useState([]);
  const [JobData, setJobData] = useState({
    jobName: '',
    jobTime: '',
    companyName: '',
    isPaid: '',
    jobLocation: '',
    jobDescription: '',
    jobCategory: '',
    salary: '',
    joblevel: ''

  });
  //////////////////////////////////////////////////////////////////
  const [applicants, setApplicants] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/applicants/${Nameofjobs}`);
        let applicantsData = response.data;
  
        if (isChecked) {
          // Count the number of experiences that match the description for each applicant
          const applicantsWithExperienceCount = applicantsData.map(applicant => {
            const experiencesArray = applicant.experiences.split(', ');
            const matchedExperiencesCount = experiencesArray.filter(experience => 
              experience.toLowerCase().includes(Description.toLowerCase())
            ).length;
            return { ...applicant, matchedExperiencesCount };
          });
  
          // Filter jobs based on the presence of any skill in the skills array
          const applicantsWithMatchedSkills = applicantsWithExperienceCount.filter(job => {
            const skillsArray = job.skills.split(',');
            const matchedSkills = skillsArray.filter(skill => 
              Description.toLowerCase().includes(skill.toLowerCase())
            );
            // Add matched skills count to each job
            job.matchedSkillsCount = matchedSkills.length;
            return matchedSkills.length > 0;
          });
  
          // Sort applicants based on the number of matched experiences (in descending order),
          // then by the number of matched skills (in descending order),
          // and finally by location (alphabetically)
          const sortedApplicants = applicantsWithMatchedSkills.sort((a, b) => {
            if (b.matchedExperiencesCount !== a.matchedExperiencesCount) {
              return b.matchedExperiencesCount - a.matchedExperiencesCount;
            } else if (b.matchedSkillsCount !== a.matchedSkillsCount) {
              return b.matchedSkillsCount - a.matchedSkillsCount;
            } else {
              return a.location.localeCompare(b.location);
            }
          });
  
          // Set the final filtered and sorted applicants
          setApplicants(sortedApplicants);
        } else {
          setApplicants(applicantsData);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };
  
    fetchApplicants();
  }, [Nameofjobs, Description, Location, isChecked]);
   // Trigger the effect whenever Nameofjobs, Description, or Location changes
  
  // Function to count the number of matched skills between job description and skills
  const getMatchedSkillsCount = (skillsString) => {
    const skillsArray = skillsString.split(',');
    const matchedSkills = skillsArray.filter(skill => Description.toLowerCase().includes(skill.toLowerCase()));
    return matchedSkills.length;
  };
  
  
  
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };
  console.log(applicants);

  //here is change 20022
  /////////////////////////////////////////////////
  useEffect(() => {
    const fetchJobs = () => {
      return axios.get(`http://localhost:3002/jobsCompID/${id}`)
        .then(response => {
          setJobData({
            jobName: response.data.results[0].Nameofjobs,
            jobTime: response.data.results[0].jobtime,
            companyName: response.data.results[0].CompanyName,
            isPaid: response.data.results[0].isPaid,
            jobLocation: response.data.results[0].Location,
            jobDescription: response.data.results[0].Description,
            jobCategory: response.data.results[0].Majored,
            salary: response.data.results[0].salary,
            joblevel: response.data.results[0].JobLevel
          });
          console.log(JobData);
          //fetchPDF(); // Call fetchPDF after fetchJobs completes
        })
        .catch(error => {
          console.error('Error fetching job data:', error);
        });
    };
  
    /*const fetchPDF = () => {
      axios.get(`http://localhost:3002/appearpdf/${user.username}/${Nameofjobs}`)
        .then(response => {
          console.log(response);
          setPdf(response.data.results);
        })
        .catch(error => {
          console.error('Error fetching PDF:', error);
        });
    };*/
  
    fetchJobs();
  }, [])
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...JobData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

  }
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(id)
    axios.post(`http://localhost:3002/UpdateJob/${id}/${Nameofjobs}`, JobData, {
          
        })
            .then(response => {
                console.log('additional details uploaded successfully:', response.data);
                // Update the user state with the new values
            })
            .catch(error => {
                console.error('Error uploading additional details:', error);
                // Optionally, you can handle error cases
            });

  }
  const handleDelete = (e) => {
    e.preventDefault();
    console.log(id)
    axios.delete(`http://localhost:3002/deleteJob/${id}`) .then(response => {
    })
    
  }
  const handleCV = (ID) => {
    axios.get(`http://localhost:3002/getcv/${ID}`, { responseType: 'arraybuffer' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CV_${ID}.pdf`);
        link.click();
  
        // Clean up the object URL after the download
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error fetching CV:', error);
        // Handle error (e.g., show error message to the user)
      });
  };
  const handleID_Photo = (ID) => {
    axios.get(`http://localhost:3002/getID_Photo/${ID}`, { responseType: 'arraybuffer' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/png' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ID_Photo_${ID}.png`);
        link.click();
  
        // Clean up the object URL after the download
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error fetching CV:', error);
        // Handle error (e.g., show error message to the user)
      });
  };
  
  const handleAccept =(ID,users,email)=>
    
    {
      setShowPopup(true);
      
  axios.post(`http://localhost:3002/dpftypeacept/${ID}/${user.email}/${user.username}/${JobData.jobName}/${email}`) .then(response => {
}

)

const formData = new FormData();
formData.append('username', users);
formData.append('description', `You have applied to interview ${JobData.jobName}`);
formData.append('company', user.username);

axios.post(`http://localhost:3002/notification`, formData)
  .then(response => {
    // Handle the response
    console.log(response);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
////
}
  const handleReject =(ID,users,email)=>
    {
      
      axios.delete(`http://localhost:3002/dpftypedelte/${ID}/${user.email}/${user.username}/${JobData.jobName}/${email}`) .then(response => {
 })
  const formData = new FormData();
formData.append('username', users);
formData.append('description', `Your application for a ${JobData.jobName} job interview has been rejected `);
formData.append('company', user.username);

axios.post(`http://localhost:3002/notification`, formData)
  .then(response => {
    // Handle the response
    console.log(response);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
}
const handleClosePopup = () => {
  setShowPopup(false);
};

  return (
    <div className='jobManage'>
      <header>
        <h1>Job Name Manage</h1>
      </header>
      <div className='editJob'>
        <h2>Edit Job Data</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className='jobName'
              type="text"
              id="jobName"
              name="jobName"
              placeholder='Job Name'
              value={JobData.jobName}
              onChange={handleChange}
            />
          </div>
          <div className='line'>
            <div>
              <input
                type="text"
                id="jobTime"
                name="jobTime"
                placeholder='Job Time'
                value={JobData.jobTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                id="joblevel"
                name="joblevel"
                placeholder='Job Level'
                value={JobData.joblevel}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                id="jobLocation"
                name="jobLocation"
                placeholder='Job Location'
                value={JobData.jobLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='line'>
            <div>
              <input
                type="text"
                id="salary"
                name="salary"
                placeholder='Salary'
                value={JobData.salary}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                id="jobCategory"
                name="jobCategory"
                placeholder='Job Category'
                value={JobData.jobCategory}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='lastline'>
            <div>
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder='Job Description'
                value={JobData.jobDescription}
                onChange={handleChange}
              />
            </div>
            <div className='editbuttons'>
            <button className='updateButton' type="submit" onClick={handleUpdate}>Update</button>
            <button className='deleteButton' onClick={handleDelete}>Delete this Job</button>
            </div>
          </div>
        </form>
      </div>
      <div className='Applications'>
        <h2>Applications</h2>
        <label>
        <input
          type="checkbox"
          checked={isChecked} // Set the checked state based on isChecked variable
          onChange={handleCheckboxChange} // Handle checkbox change event
        />
         Fillter
      </label>
  {/*<div className='Applicants'>
          }
  <div className='user'>
            
              {applicants.map((user1, index) => (
      <div key={index}>
        <Link to={`/user/${user1.username}`}>
          <UserComponent userData={{
            image: '',
            username: user1.username,
            email: user1.email,
            isPaid: user1.isPaid
          }} />
        </Link>
        
        <div className='buttons'>
          <button className='cv' onClick={() => handleCV(user1.ID)}>CV</button>
          <button className='accept' onClick={() => handleAccept(user1.ID, user.email)}>Accept</button>
          <button className='reject' onClick={() => handleReject(user1.ID, user.email)}>Reject</button>
          <button className='ID_Photo' onClick={() => handleID_Photo(user1.ID)}>ID Photo</button>
          
          {showPopup && <InterviewPopup  onClose={handleClosePopup} username={user1.username} jobName={JobData.jobName} company={user.username}  />}
        </div>
        
      </div>
    ))}

                
              </div>


        </div>*/}
        { <div className="Applicants">
      {applicants.map((user1, index) => (
        <div className="user" key={index}>
          <Link to={`/user/${user1.username}`}>
            <UserComponent userData={{
              image: '',
              username: user1.username,
              email: user1.email,
              isPaid: user1.isPaid
            }} />
          </Link>
          
          <div className="buttons">
            <button className="cv" onClick={() => handleCV(user1.ID)}>CV</button>
            <button className="accept" onClick={() => handleAccept(user1.ID,user1.username, user1.email)}>Accept</button>
            <button className="reject" onClick={() => handleReject(user1.ID,user1.username, user1.email)}>Reject</button>
            <button className="ID_Photo" onClick={() => handleID_Photo(user1.ID)}>ID Photo</button>
          </div>
          
          {showPopup && <InterviewPopup onClose={handleClosePopup} username={user1.username} jobName={JobData.jobName} company={user.username} />}
        </div>
      ))}
    </div>}
      </div>
    </div>
  )
}