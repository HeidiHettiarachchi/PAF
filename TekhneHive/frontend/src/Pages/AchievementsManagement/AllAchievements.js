import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import Modal from 'react-modal';
Modal.setAppElement('#root');

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievements?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievements deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievements.');
        }
      } catch (error) {
        console.error('Error deleting Achievements:', error);
      }
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="posts-container">
      <NavBar />
      <div className="content-wrapper">
        <div className="search-section" style={{ marginTop: '40px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search achievements by title or description"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            onClick={() => window.location.href = '/addAchievements'}
            className="create-post-btn"
          >
            <IoIosCreate /> Create Achievement
          </button>
        </div>

        <div className="posts-grid">
          {filteredData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <p>No achievements found. Please create a new achievement.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => window.location.href = '/addAchievements'}
                  className="create-post-btn"
                >
                  <IoIosCreate /> Create Achievement
                </button>
              </div>
            </div>
          ) : (
            filteredData.map((progress) => (
              <div key={progress.id} className="post-card">
                <div className="post-header">
                  <div className="post-owner">
                    <div className="owner-avatar">
                      <span className="owner-avatar-placeholder">
                        {(progress.postOwnerName || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="owner-name" style={{ color: '#ffffff'}}>{progress.postOwnerName}</p>
                      <p className="post-date" style={{ color: '#ffffff'}}>{progress.date}</p>
                    </div>
                  </div>
                  {progress.postOwnerID === userId && (
                    <div className="post-actions">
                      <button className="edit-btn" onClick={() => window.location.href = `/updateAchievements/${progress.id}`}>
                        <FaEdit size={18} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(progress.id)}>
                        <RiDeleteBin6Fill size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="post-content" >
                  <h2 className="post-title" style={{ color: '#fbff00'}}>{progress.title}</h2>
                  <p className="post-description" style={{ whiteSpace: "pre-line", color: 'white' }}>{progress.description}</p>

                  {progress.imageUrl && (
                    <div className="media-grid">
                      <div className="media-item" onClick={() => openModal(`http://localhost:8080/achievements/images/${progress.imageUrl}`)}>
                        <img 
                          src={`http://localhost:8080/achievements/images/${progress.imageUrl}`}
                          alt="Achievement"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="modal-close" onClick={closeModal}>×</button>
        {selectedImage && (
          <img src={selectedImage} alt="Full size" />
        )}
      </Modal>
    </div>
  );
}

export default AllAchievements;
