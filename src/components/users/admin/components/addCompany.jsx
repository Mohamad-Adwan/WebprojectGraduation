import React, { useState, useRef } from 'react';
import { object, string } from 'yup';
import { toast, Bounce } from 'react-toastify';
import './AddCompany.Module.css';
import axios from 'axios';

export default function AddCompany() {

  const fileInputRef = useRef(null);
  const formData = new FormData();
  const [company, setCompany] = useState({
    name: '',
    jobImg: '',
    email: '',
    isPaid: '',
    size: '',
    majored: '',
    isAdmin: '', // New field for user type
  })

  const [errors, setErrors] = useState({
    name: '',
    jobImg: '',
    email: '',
    isPaid: '',
    size: '',
    majored: '',
    isAdmin: '', // New field for user type
  })

  const validateData = async () => {
    const schema = object({
      name: string().required(),
      email: string().email().required(),
      size: string().required(),
      majored: string().required(),
      isPaid: string().required(),
      isAdmin: string().required(), // Validation for user type
    });

    try {
      await schema.validate(company, { abortEarly: false });
      setErrors({
        name: '',
        jobImg: '',
        email: '',
        isPaid: '',
        size: '',
        majored: '',
        isAdmin: '', // Reset error for user type
      })
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(e => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
      error.errors.map(errors => {
        toast.error(errors, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      })
      return false;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({
      ...company,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setCompany({
      ...company,
      [name]: files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(company.isAdmin);
    
    console.log(company.isAdmin);
    formData.append('name', company.name);
    formData.append('image', company.jobImg);
    formData.append('email', company.email);
    formData.append('isPaid', company.isPaid);
    formData.append('size', company.size);
    formData.append('majored', company.majored);
    formData.append('isAdmin', company.isAdmin); // Append user type

    console.log(formData);
    await axios.post('http://localhost:3002/newuser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log('Response from backend:', response.data);
    }).catch(error => {
      console.error('Error from backend:', error);
    });

  }

  return (
    <div className='AddCompanyPage'>
      <h1>Add New Company</h1>
      <form onSubmit={handleSubmit}>
        <div
          className="jobImgContainer"
          onClick={() => fileInputRef.current.click()}
          style={{ cursor: 'pointer' }}
        >
          {company.jobImg && <img src={company.jobImg} alt="Job Preview" />}
          <input
            ref={fileInputRef}
            type="file"
            id="jobImg"
            name="jobImg"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <span className="imageHoverText">Select Image</span>
        </div>
        <div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder='Company Name'
            value={company.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={company.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            id="majored"
            name="majored"
            placeholder='Company Majored'
            value={company.majored}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="number"
            id="size"
            name="size"
            placeholder='Number of Employees'
            value={company.size}
            onChange={handleChange}
          />
        </div>
        <div>
          <select name='isPaid' value={company.isPaid} onChange={handleChange}>
            <option value='' disabled>Select Account Type</option>
            <option value='0'>Free Account</option>
            <option value='1'>Paid Account</option>
          </select>
        </div>
        <div>
          <select name='isAdmin' value={company.isAdmin} onChange={handleChange}>
            <option value='' disabled>Select User Type</option>
            <option value='0'>User</option>
            <option value='1'>Admin</option>
            <option value='2'>Company</option>
          </select>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
