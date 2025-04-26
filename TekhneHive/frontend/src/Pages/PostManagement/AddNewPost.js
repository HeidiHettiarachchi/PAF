import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css';

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div className="modern-container">
      <NavBar />
      <div className="gradient-wrapper">
        <div className="modern-card">
          <div className="card-header">
            <h1>Create a Post</h1>
            <div className="gradient-divider"></div>
            <p className="header-caption">Share your story with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-container">
              <div className="input-icon">✏️</div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Write an engaging title"
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">📝</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts..."
                className="modern-input"
              />
            </div>

            <div className="input-container">
              <div className="input-icon">🏷️</div>
              <select
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
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
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="preview-box">
                    {preview.type.startsWith('video/') ? (
                      <video controls className="preview-media">
                        <source src={preview.url} type={preview.type} />
                      </video>
                    ) : (
                      <img className="preview-media" src={preview.url} alt={`Preview ${index}`} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="dropzone">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,video/mp4"
                  multiple
                  onChange={handleMediaChange}
                  id="file-upload"
                  className="hidden-input"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📤</div>
                  <span>Drop files here or click to browse</span>
                </label>
              </div>
            </div>

            <button type="submit" className="gradient-button">
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
