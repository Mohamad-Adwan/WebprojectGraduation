import React, { useContext,useRef, useState } from "react";
import axios from 'axios';
import "./JobComponent.Module.css";
import { FaCompassDrafting, FaBullhorn, FaMoneyBills, FaChartLine, FaDesktop, FaCode, FaUsers, FaBriefcase, FaRegFilePdf, FaFilePdf } from "react-icons/fa6";
import { SiLibreofficewriter } from "react-icons/si";
import { UserContext } from '../../../Contexts/User';

export default function jobcomponent({ jobDetails, isCompany }) {
  const [application, setApplication] = useState(false);
  const [errors, seterrors] = useState('');

  const [CV, setCV] = useState({
    pdf: '',
    ID_photo:''
  })
  const [ID_photoo, setID_photo] = useState({
    
    ID_photo:'',
  })
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);

  const { user, setUser } = useContext(UserContext);

  const handlePDFChange = (e) => {
    const { files } = e.target;
    setCV({
      pdf: files[0],
      
    })
  }
  const handlePhotoChange = (e) => {
    const { files } = e.target;
    setID_photo({
      ID_photo: files[0],
      
    })
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('jobname', jobDetails.jobName);
    formData.append('companyName', jobDetails.companyName);
    formData.append('email', user.email);
    formData.append('pdf', CV.pdf);
    formData.append('ID_image', ID_photoo.ID_photo);
    if (!ID_photoo.ID_photo || !CV.pdf) {
      const notificationData = {
        username: user.username,
        description: `Error uploading PDF file to  ${jobDetails.jobName} job. *empty file `,
        company: jobDetails.companyName
      };
      await axios.post('http://localhost:3002/notification', notificationData);
    }
    try {
      const response = await axios.post(`http://localhost:3002/upload-pdf/${user.username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  //console.log('eafaef')
      // Check the response data for success or error message
        if (response.data.success) {
        // Send notification if upload is successful
        const notificationData = {
          username: user.username,
          description: `PDF file uploaded successfully to ${jobDetails.jobName}`,
          company: jobDetails.companyName
        };
        await axios.post('http://localhost:3002/notification', notificationData);
        console.log('PDF file uploaded successfully');
      } else {
        // Handle unsuccessful upload
        const notificationData = {
          username: user.username,
          description: `Error uploading PDF file to ${jobDetails.jobName} job. `,
          company: jobDetails.companyName
        };
        await axios.post('http://localhost:3002/notification', notificationData);
        console.error('Upload failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error from backend:', error);
      // Handle network errors or other exceptions
    }
  
    setApplication(false);
  };
  

  return (
    
    <div className="jobcomponent">
      
      {!application ? <div className="jobDiv">
      {jobDetails.jobCatigory ? (jobDetails.jobCatigory == 'Design' && <FaCompassDrafting className="image" /> ||
          jobDetails.jobCatigory == 'Sales' && <FaChartLine className="image" /> ||
          jobDetails.jobCatigory == 'Marketing' && <FaBullhorn className="image" /> ||
          jobDetails.jobCatigory == 'Finance' && <FaMoneyBills className="image" /> ||
          jobDetails.jobCatigory == 'Technology' && <FaDesktop className="image" /> ||
          jobDetails.jobCatigory == 'Engineering' && <FaCode className="image" /> ||
          jobDetails.jobCatigory == 'Developer' && <FaCode className="image" /> ||
          jobDetails.jobCatigory == 'Business' && <FaBriefcase className="image" /> ||
          jobDetails.jobCatigory == 'Human Resources' && <FaUsers className="image" /> ||
          <SiLibreofficewriter className="image" />)
          : <SiLibreofficewriter className="image" />}
        <div className="label">
          <h3>{jobDetails.jobName}</h3>
          <div>
            <p className="companyName">{jobDetails.companyName}</p>

          </div>
          <div>
            <p>{jobDetails.jobLocation}</p>

          </div>

        </div>
        <p className="jobdiscription">{jobDetails.jobDiscription}</p>
        <p className={`${jobDetails.jobCatigory} jobCatigory`}>
          {jobDetails.jobCatigory}
        </p>
        {!isCompany && <div className="buttons">
          <button onClick={() => setApplication(true)}>Apply</button>
        </div>}
        <p className="jobTime">{jobDetails.jobTime}</p>
      </div> :
        <form>
          <p> Upload Your CV </p>
          <div
            className="ImgContainer"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer' }}
          >
          
          {CV.pdf ? <FaFilePdf className="pdfimage" size={60} /> : <FaRegFilePdf className="pdfimage" size={60} />}
            <input
              ref={fileInputRef}
              type="file"
              id="pdf"
              name="pdf"
              style={{ display: 'none' }}
              onChange={handlePDFChange}
            />
            
            <span className="imageHoverText">Choose PDF</span>
          </div>
          <p> Upload ID Photo </p>
          <div
            className="ImgContainer"
            onClick={() => fileInputRef1.current.click()}
            style={{ cursor: 'pointer' }}
          >
          {//<label htmlFor="pdf">{CV.pdf.name ? CV.pdf.name : 'Choose file'}</label>
          }
          {ID_photoo.ID_photo ? <FaFilePdf className="pdfimage" size={60} /> : <FaRegFilePdf className="pdfimage" size={60} />}
            <input
              ref={fileInputRef1}
              type="file"
              id="ID_photo"
              name="ID_photo"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            
            <span className="imageHoverText">Choose Image </span>
            
          </div>
          
          <button type="button" onClick={handleSubmit}>Apply</button>          
        </form>
      }
    </div>
  );
}
