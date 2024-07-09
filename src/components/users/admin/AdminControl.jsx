import React from 'react';
import './AdminControl.Module.css';
import { Outlet, NavLink } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { BsBuildingAdd } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";

export default function AdminControl() {
  return (
    <div className='AdminControlPage'>
      <div className='leftside'>
        <nav>
          <ol>
            <li><div className='link' >
              <FaHouse size={25} />
              <p>Dashboard</p>
            </div ></li>
            <li><NavLink className='link' to="/AdminControl/AddCompany" exact>
              <BsBuildingAdd size={25} />
              <p>Add Account</p>
            </NavLink></li>
            <li><NavLink className='link' to="/AdminControl/AddJob" exact>
              <IoIosAddCircle size={25} />
              <p>Add Job</p>
            </NavLink></li>
            <li><NavLink className='link' to="/AdminControl/AddUser" end>
              <FaUsersCog size={25} />
              <p>Edit Users</p>
            </NavLink></li>
            <li><NavLink className='link' to="/AdminControl/Charts" end>
              <FaChartLine size={25} />
              <p>Charts</p>
            </NavLink></li>
            <li><NavLink className='link' to="/AdminControl/ControlofEdit" end>
              <LiaUserEditSolid size={25} />
              <p>Control of Edit</p>
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
