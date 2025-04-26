import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import './UpdateUserProfile.css';

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        if (profilePicture) {
          const formData = new FormData();
          formData.append('file', profilePicture);
          await fetch(`http://localhost:8080/user/${id}/uploadProfilePicture`, {
            method: 'PUT',
            body: formData,
          });
        }
        alert('Profile updated successfully!');
        window.location.href = '/userProfile';
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modern-container">
      <NavBar />
      <div className="gradient-wrapper">
        <div className="modern-card">
          <div className="card-header">
            <h1>Update Profile</h1>
            <div className="gradient-divider"></div>
            <p className="header-caption">Enhance your professional presence</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-container">
              <div className="input-icon">👤</div>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                placeholder="Full Name"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📧</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Email Address"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">🔑</div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Password"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📱</div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const re = /^[0-9\b]{0,10}$/;
                  if (re.test(e.target.value)) {
                    handleInputChange(e);
                  }
                }}
                maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                placeholder="Phone Number"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">🎯</div>
              <div className="skills-container">
                <div className="skills-list">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="skill-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="skill-input-group">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    className="modern-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="add-skill-btn"
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>
            </div>

            <div className="input-container">
              <div className="input-icon">📝</div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write something about yourself..."
                className="modern-input"
                rows={4}
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📷</div>
              <div className="profile-upload-section">
                <div className="profile-preview">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" className="preview-image" />
                  ) : formData.profilePicturePath ? (
                    <img
                      src={`http://localhost:8080/uploads/profile/${formData.profilePicturePath}`}
                      alt="Current Profile"
                      className="preview-image"
                    />
                  ) : (
                    <div className="empty-preview">No profile picture selected</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  id="profile-upload"
                  className="hidden-input"
                />
                <label htmlFor="profile-upload" className="upload-label">
                  <span>Choose a new profile picture</span>
                </label>
              </div>
            </div>

            <button type="submit" className="gradient-button">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;
