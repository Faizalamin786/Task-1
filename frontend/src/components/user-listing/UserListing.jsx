import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import './UserListing.css';

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      loadingBarRef.current.continuousStart();

      try {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(response.data);
        loadingBarRef.current.complete();
      } catch (error) {
        console.error('Error fetching users:', error);
        loadingBarRef.current.complete();
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-listing">
      <LoadingBar
        ref={loadingBarRef}
        height={8} // Increase the height
        colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']} // Rainbow colors
      />
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const [showAllVideos, setShowAllVideos] = useState(false);
  const displayedVideos = showAllVideos ? user.videos : user.videos.slice(0, 5);

  const handleViewAll = () => {
    const userFullName = `${user.firstname}-${user.lastname}`;
    navigate(`/users/${userFullName}`);
  };

  return (
    <div className="user-card">
      <img
        src={`http://localhost:5000/api/auth/profile-image/${user._id}`}
        alt={`${user.firstname}'s profile`}
        className="profile-image"
      />
      <h2>{user.firstname}</h2>
      <div className="videos">
        {displayedVideos.map((video, index) => (
          <video key={index} controls width="200" height="200" className="video-item">
            <source src={`http://localhost:5000/api/auth/video/${user._id}/${index}`} type={video.contentType} />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
      {user.videos.length > 4 && (
        <button onClick={handleViewAll}>View All</button>
      )}
    </div>
  );
};

export default UserListing;
