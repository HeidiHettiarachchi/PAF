import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import Modal from 'react-modal';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FiSave } from "react-icons/fi";
import { TbPencilCancel } from "react-icons/tb";
import { FaCommentAlt } from "react-icons/fa";
import './AllPost.css';
Modal.setAppElement('#root');

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);

        const userIDs = [...new Set(response.data.map((post) => post.userID))];
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                console.warn(`User with ID ${userID} not found. Removing their posts.`);
                setPosts((prevPosts) => prevPosts.filter((post) => post.userID !== userID));
                setFilteredPosts((prevFilteredPosts) => prevFilteredPosts.filter((post) => post.userID !== userID));
              } else {
                console.error(`Error fetching user details for userID ${userID}:`, error);
              }
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log('Post Owners Map:', ownerMap);
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userID}/followedUsers`);
          setFollowedUsers(response.data);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts);
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to follow/unfollow users.');
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, { unfollowUserID: postOwnerID });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        await axios.put(`http://localhost:8080/user/${userID}/follow`, { followUserID: postOwnerID });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId] || '';
    if (!content.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem('userID');
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem('userID');
      await axios.put(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setEditingComment({});
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
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
            placeholder="Search posts by title, description, or category"
            value={searchQuery}
            onChange={handleSearch}
          />
          {/* <button
            onClick={() => window.location.href = '/addNewPost'}
            className="create-post-btn"
          >
            <IoIosCreate /> Create Post
          </button> */}


          <button
            onClick={() => window.location.href = '/addNewPost'}
            className="c-button c-button--gooey"
          >
            <IoIosCreate /> Create Post
            <div className="c-button__blobs">
              <div></div>
              <div></div>
              <div></div>
            </div>

          </button>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'block', height: 0, width: 0 }}>
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
                <feBlend in="SourceGraphic" in2="goo"></feBlend>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="empty-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="empty-state-icon"></div>
              <p>No posts found. Please create a new post.</p>
              <button
                onClick={() => window.location.href = '/addNewPost'}
                className="create-post-btn"
                style={{ marginTop: '20px' }}
              >
                <IoIosCreate /> Create Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-owner">
                    <div className="owner-avatar">
                      {/* You can replace this with actual user avatar if available */}
                      <span className="owner-avatar-placeholder">
                        {(postOwners[post.userID] || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="owner-name">{postOwners[post.userID] || 'Anonymous'}</p>
                      {post.userID !== loggedInUserID && (
                        <button
                          className={`follow-btn ${followedUsers.includes(post.userID) ? 'following' : ''}`}
                          onClick={() => handleFollowToggle(post.userID)}
                        >
                          {followedUsers.includes(post.userID) ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                  </div>
                  {post.userID === loggedInUserID && (
                    <div className="post-actions">
                      <button className="edit-btn" onClick={() => handleUpdate(post.id)}>
                        <FaEdit size={18} />
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                        <MdDelete size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>
                  <p className="post-category">Category: {post.category || 'Uncategorized'}</p>

                  <div className="media-grid">
                    {post.media.slice(0, 1).map((mediaUrl, index) => (
                      <div
                        key={index}
                        className="media-item"
                        onClick={() => openModal(mediaUrl)}
                      >
                        {mediaUrl.endsWith('.mp4') ? (
                          <video>
                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          </video>
                        ) : (
                          <img src={`http://localhost:8080${mediaUrl}`} alt="" />
                        )}
                      </div>
                    ))}
                    {post.media.length > 1 && (
                      <div className="media-counter" onClick={() => openModal(post.media[0])}>
                        +{post.media.length - 1} more
                      </div>
                    )}
                  </div>

                  <div className="post-actions">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`action-btn ${post.likes?.[localStorage.getItem('userID')] ? 'liked' : ''}`}
                      >
                        <BiSolidLike size={20} />
                        <span>{Object.values(post.likes || {}).filter(liked => liked).length}</span>
                      </button>
                      <button className="action-btn">
                        <FaCommentAlt size={18} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>

                  <div className="comments-section">
                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="Add a comment"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      />
                      <button onClick={() => handleAddComment(post.id)}>
                        <IoSend />
                      </button>
                    </div>

                    {post.comments?.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div>
                          <p>{comment.userFullName}</p>
                          {editingComment.id === comment.id ? (
                            <input
                              type="text"
                              value={editingComment.content}
                              onChange={(e) =>
                                setEditingComment({ ...editingComment, content: e.target.value })
                              }
                              autoFocus
                            />
                          ) : (
                            <p>{comment.content}</p>
                          )}
                        </div>
                        <div className="comment-actions">
                          {comment.userID === loggedInUserID && (
                            <>
                              {editingComment.id === comment.id ? (
                                <>
                                  <button className="save-btn-comment"
                                    onClick={() =>
                                      handleSaveComment(post.id, comment.id, editingComment.content)
                                    }
                                  >
                                    {/* <FiSave /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="editIcon" viewBox="0 0 16 16">
                                      <path d="M13.485 1.929a1 1 0 0 1 0 1.414L6.414 10.414l-3.9-3.9a1 1 0 1 1 1.414-1.414l2.485 2.485 6.657-6.657a1 1 0 0 1 1.414 0z" />
                                    </svg>

                                  </button>
                                  <button className="cancel-btn-comment" onClick={() => setEditingComment({})}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                                      <path d="M2.5 2.5l11 11m0-11l-11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="edit-btn-comment"
                                    onClick={() =>
                                      setEditingComment({ id: comment.id, content: comment.content })
                                    }
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="editIcon" viewBox="0 0 16 16">
                                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1.292 1.292-2.148-2.148L13.354.5a.5.5 0 0 1 .707 0l1.44 1.44zM1 13.5V16h2.5l9.255-9.255-2.148-2.148L1 13.5z" />
                                    </svg>


                                  </button>



                                  <button className="delete-btn-comment" onClick={() => handleDeleteComment(post.id, comment.id)}>

                                    <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                                      <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                                    </svg>
                                  </button>
                                </>
                              )}
                            </>
                          )}
                          {post.userID === loggedInUserID && comment.userID !== loggedInUserID && (
                            <button onClick={() => handleDeleteComment(post.id, comment.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
        <button className="modal-close" onClick={closeModal}>✕</button>
        {selectedMedia && selectedMedia.endsWith('.mp4') ? (
          <video controls>
            <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
          </video>
        ) : (
          <img src={`http://localhost:8080${selectedMedia}`} alt="Full Media" />
        )}
      </Modal>
    </div>
  );
}

export default AllPost;
