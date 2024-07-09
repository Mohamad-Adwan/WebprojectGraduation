import React, { useContext,useState, useRef,useEffect } from 'react';
import './UploadJob.Module.css';
import axios from 'axios'; // Import Axios
import { UserContext } from "../../../../Contexts/User";

export default function UploadNewJob() {
    const formData = new FormData();
    const { user, setUser } = useContext(UserContext);

    //const [UsernameAndisPaid, setUsernameAndisPaid] = useState("");
    const [JobData, setJobData] = useState({
        jobName: '',
        jobTime: '',
        companyName: '',
        isPaid:'',
        jobLocation: '',
        jobDescription: '',
        jobCategory: '',
        salary:'',
        joblevel:''
        
    });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData({
            ...JobData,
            [name]: value
        });
    
        // Update formData here to avoid duplicates
        formData.set(name, value);
    };

    
    //////////
   /* useEffect(() => {
        axios.get(`http://localhost:3002/onlinecompany/${user.username}`)
            .then(response => {
                console.log(response,'sssss');
                setUsernameAndisPaid(response);
                handleSubmit(); // Call handleSubmit after successfully fetching user data
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle error if necessary
            });
    }, []);*/

    const handleSubmit = async (e) => {
       
        e.preventDefault();
        formData.append('jobName',JobData.jobName);
        formData.append('jobTime',JobData.jobTime);
        formData.append('companyName', user.username);
        formData.append('isPaid', user.isPaid);
        formData.append('jobLocation',JobData.jobLocation);
        formData.append('jobDescription',JobData.jobDescription);
        formData.append('jobCategory',JobData.jobCategory);
        formData.append('salary',JobData.salary);
        formData.append('joblevel',JobData.joblevel); 
        console.log(formData);

        try {
            // Make a POST request to your backend endpoint
            await axios.post('http://localhost:3002/newjobCom', formData);
              /*  Img: formData.jobImg,
                name: formData.jobName,
                jobTime: formData.jobTime,
                company: formData.companyName,
                location: formData.jobLocation,
                description: formData.jobDescription,
                selectedMajored: formData.jobCategory,
                jobtime:formData.jobTime,
                salary:formData.salary,
                JobLevel:formData.joblevel
            });*/
            
            console.log("Data uploaded successfully.");
            // Reset Job data after successful upload
            setJobData({
                jobName: '',
                jobTime: '',
                companyName: '',
                jobLocation: '',
                jobDescription: '',
                jobCategory: '',
                salary:'',
                joblevel:''
            });
        } catch (error) {
            console.error('Error:', error);
        }
    
    };

    return (
        <div className='upJob'>
            <h1>Add Job</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="jobName"
                        name="jobName"
                        placeholder='Job Name'
                        value={JobData.jobName}
                        onChange={handleChange}
                    />
                </div>
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
               {/* <div>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        placeholder='Company Name'
                        value={JobData.companyName}
                        onChange={handleChange}
                    />
                </div>*/}
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
                <div>
                    <textarea
                        id="jobDescription"
                        name="jobDescription"
                        placeholder='Job Description'
                        value={JobData.jobDescription}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}