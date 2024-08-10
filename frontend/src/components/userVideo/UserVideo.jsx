import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const UserVideos = () => {
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      loadingBarRef.current.continuousStart();

      try {
        const response = await fetch(`http://localhost:5000/api/auth/videos/${username}`);
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
          loadingBarRef.current.complete();
        } else {
          console.error('Failed to fetch videos');
          loadingBarRef.current.complete();
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        loadingBarRef.current.complete();
      }
    };

    fetchVideos();
  }, [username]);

  return (
    <div>
      <LoadingBar  color="#f11946" ref={loadingBarRef}   height={8}   />
      <h2>All Videos of {username.replace('-', ' ')}</h2>
      <div className="videos">
        {videos.map((video, index) => (
          <video key={index} controls width="250" height="250" className="video-item">
            <source src={`data:${video.contentType};base64,${video.data}`} type={video.contentType} />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  );
};

export default UserVideos;
