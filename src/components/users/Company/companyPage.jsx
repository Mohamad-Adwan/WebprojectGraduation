import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { BsBuildingAdd } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import './CompanyPage.Module.css';

export default function companyPage() {
  return (
    <div className='companyPage'>
        <div className='leftside'>
        <nav>
          <ol>
            <li><div className='link' >
              <FaHouse size={25} />
              <p>Dashboard</p>
            </div></li>
            <li><NavLink className='link' to="/Company/Profile" exact>
              <BsBuildingAdd size={25} />
              <p>Profile</p>
            </NavLink></li>
            <li><NavLink className='link' to="/Company/AddJob" exact>
              <IoIosAddCircle size={25} />
              <p>Add Job</p>
            </NavLink></li>
            <li><NavLink className='link' to="/Company/Jobs" end>
              <FaUsersCog size={25} />
              <p>Edit Jobs</p>
            </NavLink></li>
            <li><NavLink className='link' to="/Company/Interviews" end>
              <MdDateRange size={25} />
              <p>Interviews</p>
            </NavLink></li>
          </ol>
        </nav>
      </div>
      <div className='rightside'>
        <Outlet />
      </div>
    </div>
  )
}
