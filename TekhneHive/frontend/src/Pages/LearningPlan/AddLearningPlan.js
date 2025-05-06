import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css'; // Import the updated CSS files
import '../PostManagement/AddNewPost.css'; // Add this import
import NavBar from '../../Components/NavBar/NavBar';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date.");
      setIsSubmitting(false);
      return;
    }

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    if (!templateID) {
      alert("Please select a template.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      }

      // Create the new post object
      const newPost = {
        title,
        description,
        contentURL,
        tags,
        postOwnerID,
        postOwnerName,
        imageUrl,
        templateID,
        startDate, // New field
        endDate,   // New field
        category   // New field
      };

      // Submit the post dataa
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  return (
    <div className="post-creator">
      <NavBar />
      <div className="creator-wrapper">
        <div className='continSection'>
          <div className="template-preview-container">
            {/* Template 1 */}
            <div className="template template-1">
              <p className='template_id_one'>template 1</p>
              <p className='template_title'>{title || "Title Preview"}</p>
              <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
              <p className='template_description'>{category}</p>
              <hr></hr>
              <p className='template_description'>{description || "Description Preview"}</p>
              <div className="tags_preview">
                {tags.map((tag, index) => (
                  <span key={index} className="tagname">#{tag}</span>
                ))}
              </div>
              {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
              {contentURL && (
                <iframe
                  src={getEmbedURL(contentURL)}
                  title="Content Preview"
                  className="iframe_preview"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}

            </div>
            {/* Template 2 */}
            <div className="template template-2">
              <p className='template_id_one'>template 2</p>
              <p className='template_title'>{title || "Title Preview"}</p>
              <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
              <p className='template_description'>{category}</p>
              <hr></hr>
              <p className='template_description'>{description || "Description Preview"}</p>
              <div className="tags_preview">
                {tags.map((tag, index) => (
                  <span key={index} className="tagname">#{tag}</span>
                ))}
              </div>
              <div className='preview_part'>
                <div className='preview_part_sub'>
                  {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview_new" />}
                </div>
                <div className='preview_part_sub'>
                  {contentURL && (
                    <iframe
                      src={getEmbedURL(contentURL)}
                      title="Content Preview"
                      className="iframe_preview_new"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
            {/* Template 3 */}
            <div className="template template-3">
              <p className='template_id_one'>template 3</p>
              {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
              {contentURL && (
                <iframe
                  src={getEmbedURL(contentURL)}
                  title="Content Preview"
                  className="iframe_preview"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
              <p className='template_title'>{title || "Title Preview"}</p>

              <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
              <p className='template_description'>{category}</p>
              <hr></hr>
              <p className='template_description'>{description || "Description Preview"}</p>
              <div className="tags_preview">
                {tags.map((tag, index) => (
                  <span key={index} className="tagname">#{tag}</span>
                ))}
              </div>

            </div>
          </div>
          <div className="modern-container" style={{maxWidth: '600px', margin: '0 auto'}}>
            <div className="modern-card">
              <div className="card-header">
                <h1>Create Learning Plan</h1>
                <div className="gradient-divider"></div>
                <p className="header-caption">Design your learning journey</p>
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
                  <div className="tags-input-wrapper">
                    <div className="tags-display">
                      {tags.map((tag, index) => (
                        <span key={index} className="tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="tag-input-group">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags..."
                        className="modern-input"
                      />
                      <button type="button" onClick={handleAddTag} className="tag-add-btn">
                        <IoMdAdd />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="input-container">
                  <div className="input-icon">📋</div>
                  <select
                    value={templateID}
                    onChange={(e) => setTemplateID(e.target.value)}
                    required
                    className="modern-select"
                  >
                    <option value="">Select Template</option>
                    <option value="1">Template 1</option>
                    <option value="2">Template 2</option>
                    <option value="3">Template 3</option>
                  </select>
                </div>

                <div className="input-container">
                  <div className="input-icon">📅</div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="modern-input"
                  />
                </div>

                <div className="input-container">
                  <div className="input-icon">📅</div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="modern-input"
                  />
                </div>

                <div className="input-container">
                  <div className="input-icon">🏷️</div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="modern-select"
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="Tech">Tech</option>
                    <option value="Programming">Programming</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>

                <div className="media-section">
                  <div className="media-buttons" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowContentURLInput(!showContentURLInput)}
                      className="gradient-button"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        background: 'linear-gradient(90deg, #4299e1, #667eea)'
                      }}
                    >
                      <FaVideo /> Add Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                      className="gradient-button"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        background: 'linear-gradient(90deg, #667eea, #764ba2)'
                      }}
                    >
                      <FaImage /> Add Image
                    </button>
                  </div>

                  {showContentURLInput && (
                    <div className="input-container">
                      <div className="input-icon">🎥</div>
                      <input
                        type="url"
                        value={contentURL}
                        onChange={(e) => setContentURL(e.target.value)}
                        placeholder="Enter content URL"
                        className="modern-input"
                      />
                    </div>
                  )}

                  {showImageUploadInput && (
                    <div className="dropzone">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="file-upload"
                        className="hidden-input"
                      />
                      <label htmlFor="file-upload" className="upload-label">
                        <div className="upload-icon">📤</div>
                        <span>Drop image here or click to browse</span>
                      </label>
                      {imagePreview && (
                        <div className="preview-grid">
                          <div className="preview-box">
                            <img src={imagePreview} alt="Preview" className="preview-content" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="gradient-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Learning Plan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningPlan;