import React, { useState, useRef,useEffect } from 'react';
import './UploadJob.Module.css';
import axios from 'axios'; // Import Axios
export default function UploadNewJob() {
    const formData = new FormData();
    const [UsernameAndisPaid, setUsernameAndisPaid] = useState("");
    const [JobData, setJobData] = useState({
        jobImg: '',
        jobName: '',
        jobTime: '',
        companyName: '',
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
    };

    const handleImageChange = (e) => {
        const {name , files} = e.target;
        setJobData({
            ...JobData,
            [name]:files[0]
        });
    };
    //////////
   /* useEffect(() => {
        axios.get(`http://localhost:3002/onlinecompany`)
        .then(response => {
            console.log(response.data.results[0].username,'sssss');
            setUsernameAndisPaid(response);
            
            handleSubmit(); // Call handleSubmit after successfully fetching user data
    })
    
       
    }, []);
    */
    /////

    const handleFrameClick = () => {
        // تشغيل نافذة اختيار الملف عند النقر على الإطار
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
       
        e.preventDefault();
        formData.append('jobImg',JobData.jobImg);
        formData.append('jobName',JobData.jobName);
        formData.append('jobTime',JobData.jobTime);
        formData.append('companyName', UsernameAndisPaid.data.results[0].username);
        formData.append('isPaid', UsernameAndisPaid.data.results[0].isPaid);
        formData.append('jobLocation',JobData.jobLocation);
        formData.append('jobDescription',JobData.jobDescription);
        formData.append('jobCategory',JobData.jobCategory);
        formData.append('jobTime',JobData.jobTime);
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
                jobImg: '',
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
            <form onSubmit={handleSubmit}>
                <div
                    className="jobImgContainer"
                    onClick={handleFrameClick}
                    style={{ cursor: 'pointer' }}
                >
                    {JobData.jobImg && <img src={JobData.jobImg} alt="Job Preview" />}
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="jobImg"
                        name="jobImg"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <span className="imageHoverText">اختيار صورة</span>
                </div>
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