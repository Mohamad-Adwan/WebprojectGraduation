import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './Charts.Module.css'
const JobStatsChart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [jobStats, setJobStats] = useState([]);
  const [LoginStats, setLoginStats] = useState([]);
  const [ApplayStats, setApplayStats] = useState([]);


  useEffect(() => {
    fetchJobStats();
    fetchLoginStats();
    fetchApplayStats();
  }, [startDate, endDate]);

  const fetchJobStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/job-stats', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });
      setJobStats(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching job stats:', error);
      setJobStats([]); // Ensure jobStats is an array in case of an error
    }
  };

  const fetchLoginStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/login-stats', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });
      setLoginStats(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching Login stats:', error);
      setLoginStats([]); // Ensure jobStats is an array in case of an error
    }
  };
  const fetchApplayStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/applay-stats', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });
      setApplayStats(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching Jobapplay stats:', error);
      setApplayStats([]); // Ensure jobStats is an array in case of an error
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const formatDatewithouttime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const chartData = {
    labels: jobStats.map(stat => formatDatewithouttime(stat.date)),
    datasets: [
      {
        label: 'Number of Jobs add pre Day',
        data: jobStats.map(stat => stat.Jobs),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const chartDatalogin = {
    labels: LoginStats.map(stat => formatDatewithouttime(stat.date)),
    datasets: [
      {
        label: 'Number of Login pre Day',
        data: LoginStats.map(stat => stat.Login),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const chartDataapplay = {
    labels: ApplayStats.map(stat => formatDatewithouttime(stat.date)),
    datasets: [
      {
        label: 'Number of Job applay pre Day',
        data: ApplayStats.map(stat => stat.Jobapplay),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }; 
  
  
  
  const options = {
   // maintainAspectRatio: false, // Disable aspect ratio to adjust chart size
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis scale at zero
        ticks: {
          stepSize: 1, // Adjust the step size for the y-axis ticks
        },
      },
    },
  };
  

  return (
    <div className="chart-container"> {/* Container for the chart */}
    <h2 className='title'> Stats And Charts</h2>
    <div className='data'>
    <div>
      <label>Start Date:</label>
      <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
    </div>
    <div>
      <label>End Date:</label>
      <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
    </div>
    </div>
    <div className='charts'>
    <Line data={chartData} options={options} />
    <Line data={chartDatalogin} options={options} />
    <Line data={chartDataapplay} options={options} />
    </div>
  </div>
);
};

export default JobStatsChart;
