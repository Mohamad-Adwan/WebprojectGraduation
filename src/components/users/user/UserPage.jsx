import React, { useContext } from 'react'
import './UserPage.Module.css'
import { Outlet, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faUser,
    faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../Contexts/User"
import { MdDateRange } from "react-icons/md";
export default function UserPage() {
    const { user, setUser } = useContext(UserContext);
    return (
        <div className='userpage'>
            <div className='leftside'>
                <nav>
                    <ol>
                        <li><div className='link'>
                            <FontAwesomeIcon icon={faHouse} />
                            <p>Dashboard</p>
                        </div></li>
                        <li><NavLink className='link' to="/UserPage/Profile" end>
                            <FontAwesomeIcon icon={faUser} />
                            <p>Profile</p>
                        </NavLink></li>
                        <li><NavLink className='link' to="/UserPage/MyApplications" exact>
                            <FontAwesomeIcon icon={faFileLines} />
                            <p>My Applications</p>
                        </NavLink></li>
                        <li><NavLink className='link' to="/UserPage/Interview" exact>
                            <MdDateRange icon={faFileLines} />
                            <p>Interview</p>
                        </NavLink></li>
                    </ol>
                </nav>
            </div>
            <Outlet />

        </div>
    )
}
