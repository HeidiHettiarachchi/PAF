import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTools, FaGraduationCap, FaShareAlt, FaTrophy } from 'react-icons/fa';
import './UserProfile.css';
import NavBar from '../../Components/NavBar/NavBar';

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            fetchUserDetails(userId).then((data) => setUserData(data));
        }
    }, []);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            const userId = localStorage.getItem('userID');
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-container">
                {userData && userData.id === localStorage.getItem('userID') && (
                    <div className="profile-wrapper">
                        <div className="profile-header">
                            {userData.profilePicturePath && (
                                <div className="profile-image-container">
                                    <img
                                        src={`http://localhost:8080/uploads/profile/${userData.profilePicturePath}`}
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                </div>
                            )}
                            <div className="profile-info">
                                <h1 className="profile-name">{userData.fullname}</h1>
                                <p className="profile-bio">{userData.bio}</p>
                                <div className="profile-contact">
                                    <div className="contact-item">
                                        <FaEnvelope className="contact-icon" />
                                        <span>{userData.email}</span>
                                    </div>
                                    <div className="contact-item">
                                        <FaPhone className="contact-icon" />
                                        <span>{userData.phone}</span>
                                    </div>
                                    <div className="contact-item">
                                        <FaTools className="contact-icon" />
                                        <span>{userData.skills.join(', ')}</span>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <button onClick={() => navigate(`/updateUserProfile/${userData.id}`)} className="btn-update">
                                        Update Profile
                                    </button>
                                    <button onClick={handleDelete} className="btn-delete">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="profile-links">
                            <div className="link-card" onClick={() => navigate('/myLearningPlan')}>
                                <FaGraduationCap className="link-icon" />
                                <h3>Learning Plan</h3>
                                <p>Track your learning progress</p>
                            </div>
                            <div className="link-card" onClick={() => navigate('/myAllPost')}>
                                <FaShareAlt className="link-icon" />
                                <h3>Skill Posts</h3>
                                <p>View your shared skills</p>
                            </div>
                            <div className="link-card" onClick={() => navigate('/myAchievements')}>
                                <FaTrophy className="link-icon" />
                                <h3>Achievements</h3>
                                <p>Your accomplishments</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
