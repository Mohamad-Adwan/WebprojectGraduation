import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import './AddJob.Module.css';

export default function AddJob() {
    const formData = new FormData();
    const [JobData, setJobData] = useState({

        jobName: '',
        jobTime: '',
        Companyname: '',
        jobLocation: '',
        jobDescription: '',
        jobCategory: '',
        salary:'',
        joblevel:'',
        isPaid:''

    });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for select elements
        if (e.target.type === 'select-one') {
            setJobData({
                ...JobData,
                [name]: e.target.value // Use e.target.value instead of value
            });
        } else {
            setJobData({
                ...JobData,
                [name]: value
            });
        }
    };

    useEffect(() => {


            handleSubmit(); // Call handleSubmit after successfully fetching user data



    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();
        formData.append('jobImg',JobData.jobImg);
        formData.append('jobName',JobData.jobName);
        formData.append('jobTime',JobData.jobTime);
        formData.append('companyName', JobData.Companyname);
        formData.append('isPaid', JobData.isPaid);
        formData.append('jobLocation',JobData.jobLocation);
        formData.append('jobDescription',JobData.jobDescription);
        formData.append('jobCategory',JobData.jobCategory);
        formData.append('salary',JobData.salary);
        formData.append('joblevel',JobData.joblevel); 

        try {
            // Make a POST request to your backend endpoint
            await axios.post('http://localhost:3002/newjobAdmin', formData);
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
                jobImg: '',
                jobName: '',
                jobTime: '',
                Companyname: '',
                jobLocation: '',
                jobDescription: '',
                jobCategory: '',
                salary:'',
                joblevel:'',
                isPaid:''
            });
        } catch (error) {
            console.error('Error:', error);
        }

    };

    return (
        <div className='AddJob'>
            <h1>Add New Job</h1>
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
                <div>
                    <input
                        type="text"
                        id="Companyname"
                        name="Companyname"
                        placeholder='Company Name'
                        value={JobData.Companyname}
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
          <select name='isPaid' value={JobData.isPaid} onChange={handleChange}>
            <option value='' disabled>Select Account Type</option>
            <option value='0'>Free Job</option>
            <option value='1'>Paid Job</option>
          </select>
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

                <button type="submit">Add</button>
            </form>
        </div>
  )
}