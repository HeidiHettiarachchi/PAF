import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import './AddAchievements.css';

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
        method: 'POST',
        body: formData,
      });
      imageUrl = await uploadResponse.text();
    }

    const response = await fetch('http://localhost:8080/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, imageUrl }),
    });
    if (response.ok) {
      alert('Achievements added successfully!');
      window.location.href = '/myAchievements';
    } else {
      alert('Failed to add Achievements.');
    }
  };

  return (
    <div className="modern-container">
      <NavBar />
      <div className="gradient-wrapper">
        <div className="modern-card">
          <div className="card-header">
            <h1>Create Achievement</h1>
            <div className="gradient-divider"></div>
            <p className="header-caption">Share your milestones with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-container">
              <div className="input-icon">✏️</div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Write an engaging title"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📝</div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Share your achievement details..."
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">🏷️</div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="modern-select"
              >
                <option value="" disabled>Select a Category</option>
                <option value="Tech">Tech</option>
                <option value="Programming">Programming</option>
                <option value="Cooking">Cooking</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            <div className="input-container">
              <div className="input-icon">📅</div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="modern-input"
              />
            </div>

            <div className="media-upload-section">
              <div className="preview-area">
                {imagePreview && (
                  <div className="preview-box">
                    <img className="preview-media" src={imagePreview} alt="Achievement preview" />
                  </div>
                )}
              </div>
              
              

            <button type="submit" className="gradient-button">
              Publish Achievement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
