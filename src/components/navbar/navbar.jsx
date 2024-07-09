import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Navbar.Module.css';
import React, { useState, useContext,useEffect } from 'react';
import Logo from '../../assets/img/Logo.svg';
import Menu from '../../assets/img/burger.svg';
import Login from '../loginSignup/login';
import LoginSignup from '../loginSignup/loginSignupPage';
import { UserContext } from "../../Contexts/User"
import { IoNotificationsSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { CiRead } from "react-icons/ci";
import { CiUnread } from "react-icons/ci";

import axios from "axios";

function NotificationPopup({ notifications, onClose }) {
    const markNotificationAsRead = (id,read) => {
        
        axios.put(`http://localhost:3002/notificationread/${id}/${read}`, { read: true })
            .then(response => {
                console.log('Notification marked as read successfully');
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    };
    const handleDeleteNotification = (id) => {
        axios.delete(`http://localhost:3002/notificationdelete/${id}`)
            .then(response => {
                console.log('Notification deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    }
    if (!Array.isArray(notifications) || notifications.length === 0) {
        return (
            <div className="notification-popup">
                <div className="notification-popup-content">
                    <button className="close-btn" onClick={onClose}>Close</button>
                    <h2>Notifications</h2>
                    <p>No notifications</p>
                </div>
            </div>
        );
    }
    return (
        <div className="notification-popup-bar">
        <div className="notification-popup-content">
            <button className="close-btn" onClick={onClose}>Close</button>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                        <div>
                            <strong>Username:</strong> {notification.username}<br />
                            <strong>Description:</strong> {notification.description}<br />
                            <strong>Company:</strong> {notification.company}
                        </div>
                        {
                            <button className="delete-btn" onClick={() => handleDeleteNotification(notification.ID)}>
                                <MdDeleteForever />
                            </button>
                        }
                        <button className="read-btn" onClick={() => markNotificationAsRead(notification.ID,notification.read)}>{notification.read?<CiRead />
:<CiUnread />
}</button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
    
}

export default function navbar() {
    const { user, setUser, setToken } = useContext(UserContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const [UserBarOpen, setUserBar] = useState(false);

    const toggleUserBar = () => {
        setUserBar(!UserBarOpen);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userToken');
    }
    const [showPopup, setShowPopup] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const fetchNotifications = () => {
        axios.get(`http://localhost:3002/notification/${user.username}`)
          .then(response => {
            // Assuming notifications are stored in 'results'
            const sortedNotifications = response.data.results.sort((a, b) => b.ID - a.ID);
            setNotifications(sortedNotifications);
            console.log(sortedNotifications);
          })
          .catch(error => {
            console.error('Error fetching notifications:', error);
            // Handle error here
          });
      };

    const handleNotificationClick = () => {
        fetchNotifications(); // Fetch notifications when button is clicked
        togglePopup(); // Toggle notification popup
    };
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    return (
        <>
            <div className="navbar">
                <div className="contaner">
                    <div className="leftside">
                        <div className="logo">
                            <img src={Logo} alt="wepsite icon" />
                            <p>Hire Me</p>
                        </div>
                        <nav>
                            <ol>
                                <li><NavLink className='link' to="/">Home</NavLink></li>
                                <li><NavLink className='link' to="/Jobs">Jobs</NavLink></li>
                                <li><NavLink className='link' to="/Companies">Companies</NavLink></li>
                                <li><NavLink className='link' to="/About">About Us</NavLink></li>
                                <li><NavLink className='link' to="/Contact">Contact</NavLink></li>
                            </ol>
                        </nav>
                    </div>
                   
                    <div className="rightside">
                    {user && user.isAdmin == '0' && (
        <div className='notification-icon'>
          <button className='notification-button' >
            <IoNotificationsSharp className="notification-icon" onClick={handleNotificationClick}/>
          </button>
        </div>
      )}                        {user ?
                            <div className='logedin'>
                                <button onClick={toggleUserBar}>{user.username}</button>
                            </div>
                            : (<div className="auth">
                                <Link to="/loginSignup">Login / Sign up</Link>
                            </div>)}
                        <div className="burger">
                            <button className="bburger" onClick={toggleSidebar}><img src={Menu} alt="menu" /></button>
                        </div>
                    </div>
                </div>
            </div>
            {UserBarOpen && (
                <div className='userBar'>
                    {(user.isAdmin == '0') && <NavLink className='userlink' onClick={toggleUserBar} to="/UserPage/Profile">Profile</NavLink>||
                    (user.isAdmin == '1') && <NavLink className='userlink' onClick={toggleUserBar} to="/AdminControl">Control</NavLink>||
                    (user.isAdmin == '2') && <NavLink className='userlink' onClick={toggleUserBar} to="/Company/Profile">Profile</NavLink>}
                    <Link className='logoutbutton' onClick={()=>{toggleUserBar(); logout(); }} to="/">Log Out</Link>
                </div>
            )}                
 {showPopup && (
    
                <NotificationPopup notifications={notifications} onClose={togglePopup} />
            )}
            {sidebarOpen && (
                <div className="sidebar">
                    <nav>
                        <ol>
                            <li><NavLink onClick={toggleSidebar} className='link' to="/">Home</NavLink></li>
                            <li><NavLink onClick={toggleSidebar} className='link' to="/Jobs">Jobs</NavLink></li>
                            <li><NavLink onClick={toggleSidebar} className='link' to="/Companies">Companies</NavLink></li>
                            <li><NavLink onClick={toggleSidebar} className='link' to="/About">About Us</NavLink></li>
                            <li><NavLink onClick={toggleSidebar} className='link' to="/Contact">Contact</NavLink></li>
                        </ol>
                    </nav>
                </div>
            )}

        </>
    )
}

