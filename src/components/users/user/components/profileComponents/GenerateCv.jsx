import { React, useEffect } from 'react';
import axios from 'axios';
import './GenerateCv.Module.css'

const GenerateCv = ({ username }) => {
  const handleSubmit1 = async () => {
    try {
      // Fetch user data
      const response1 = await axios.get(`http://localhost:3002/allinformation/${username}`);
      const userData = response1.data.results[0];

      // Fetch education data
      const educationResponse = await axios.get(`http://localhost:3002/educations/${username}`);
      const educationData = educationResponse.data.results;

      // Fetch experience data
      const experienceResponse = await axios.get(`http://localhost:3002/experiences/${username}`);
      const experienceData = experienceResponse.data.results;

      // Fetch skills data
      const skillsResponse = await axios.get(`http://localhost:3002/allinformation/${username}`);
      const skillsData = skillsResponse.data.results;
      const parsedSkills = skillsData[0].Skills.split(',').map(word => ({ name: word.trim(), edit: true }));

      // Combine all the states into a single object
      const data = {
        additionalDetails: {
          email: userData.email,
          phone: userData.Phone,
          languages: userData.Languages,
        },
        mainData: {
          name: username,
          companyName: userData.companyname,
          country: userData.country,
          city: userData.city,
          image: '',
        },
        experiences: experienceData.map(experience => ({
          name: experience.companyName,
          companyName: experience.companyName,
          time: experience.time,
          startDate: experience.startDate,
          endDate: experience.endDate,
          location: experience.location,
          description: experience.discription,
          image: '',
        })),
        educations: educationData.map(education => ({
          name: education.name,
          major: education.major,
          year: education.year,
          description: education.discription,
          image: '',
        })),
        skills: parsedSkills.map(skill => ({
          name: skill.name,
        })),
      };

      // Generate PDF
      const response = await axios.post('http://localhost:3002/generate-pdf', data, {
        responseType: 'blob',
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);

      // Create a temporary download link and trigger click event
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cv.pdf');
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className='GenerateCV'>
      <h3>Generate PDF CV</h3>
      <button type="button" onClick={handleSubmit1}>Generate CV</button>
    </div>
  );
};

export default GenerateCv;
