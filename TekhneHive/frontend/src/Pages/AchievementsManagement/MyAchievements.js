import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import Modal from 'react-modal';
Modal.setAppElement('#root');

function MyAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const userId = localStorage.getItem('userID');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        const userFilteredData = data.filter((achievement) => achievement.postOwnerID === userId);
        setProgressData(userFilteredData);
        setFilteredData(userFilteredData);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

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
      <div className="content-wrapper" style={{ marginTop: '40px' }}>
        <div className='add_new_btn' onClick={() => (window.location.href = '/addAchievements')}>
          <IoIosCreate className='add_new_btn_icon' />
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
                      <p className="owner-name">{progress.postOwnerName}</p>
                      <p className="post-date">{progress.date}</p>
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

                <div className="post-content">
                  <h2 className="post-title">{progress.title}</h2>
                  <p className="post-description" style={{ whiteSpace: "pre-line" }}>{progress.description}</p>

                  {progress.imageUrl && (
                    <div className="media-grid">
                      <div className="media-item" onClick={() => openModal(`http://localhost:8080/achievements/images/${progress.imageUrl}`)}>
                        <img 
                          src={`http://localhost:8080/achievements/images/${progress.imageUrl}`}
                          alt="Achievement"
                          className="achievement-image"
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

export default MyAchievements;
