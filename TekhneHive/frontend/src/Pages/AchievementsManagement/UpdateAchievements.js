import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        window.location.href = '/allAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-container">
      <NavBar />
      <div className="gradient-wrapper">
        <div className="modern-card">
          <div className="card-header">
            <h1>Update Achievement</h1>
            <div className="gradient-divider"></div>
            <p className="header-caption">Refine and enhance your achievement</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-container">
              <div className="input-icon">✏️</div>
              <input
                type="text"
                name="title"
                placeholder="Achievement title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📝</div>
              <textarea
                name="description"
                placeholder="Describe your achievement"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">🏷️</div>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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

            <div className="media-upload-section">
              <div className="preview-area">
                {previewImage && (
                  <div className="preview-box">
                    <img
                      src={previewImage}
                      alt="Current Achievement"
                      className="preview-media"
                    />
                  </div>
                )}
              </div>
              
              <div className="dropzone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-upload"
                  className="hidden-input"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📤</div>
                  <span>Drop a new image here or click to browse</span>
                </label>
              </div>
            </div>

            <div className="input-container">
              <div className="input-icon">📅</div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="modern-input"
              />
            </div>

            <button 
              type="submit" 
              className="gradient-button"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Achievement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;