import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notification.css'
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { MdOutlineMarkChatRead } from "react-icons/md";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');




  useEffect(() => {
    
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        console.log('API Response is recorded:', response.data); 
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching the notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    } else {
      console.error('User ID is found available');
    }
  }, [userId]);

  
  const handleDeleteAction = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error  notification as read:', error);
    }
  };

  return (
    <div className="modern-container">
      <NavBar />
      <div className="gradient-wrapper">
        <div className="modern-card">
          <div className="card-header">
            <h1>Notifications</h1>
            <div className="gradient-divider"></div>
            <p className="header-caption">Stay updated with your current activities</p>
          </div>

          <div className='notifications-container'>
            {notifications.length === 0 ? (
              <div className='empty-state'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No notifications found.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
                  <div className='notification-content'>
                    <p></p>
                    <p className='noty_topic'>{notification.message}</p>
                    <p className='noty_time'>{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className='notification-actions'>
                    <MdOutlineMarkChatRead 
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{ display: notification.read ? 'none' : 'inline-block' }} 
                      className='action-icon' 
                    />
                    <RiDeleteBin6Fill
                      onClick={() => handleDeleteAction(notification.id)}
                      className='action-icon delete' 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
