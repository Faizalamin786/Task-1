import React, { useState, useRef } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import './VideoUploadBox.css';

const VideoUploadBox = ({ firstname }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const loadingBarRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024);

    if (files.length !== validFiles.length) {
      setUploadMessage('Some files exceed 50MB limit and were not selected.');
    }

    setSelectedFiles(validFiles);
    setPreviewUrls(filePreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setUploadMessage('No files selected');
      return;
    }

    if (title.length > 30 || description.length > 120) {
      setUploadMessage('Title should be less than 30 words and description less than 120 words.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('videos', file);
    });
    formData.append('firstname', firstname);
    formData.append('title', title);
    formData.append('description', description);

    try {
      loadingBarRef.current.continuousStart();
      const response = await axios.post('http://localhost:5000/api/auth/uploadVideos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          loadingBarRef.current.set(percentCompleted);
        }
      });
      setUploadMessage(response.data.message);
      setShowPopup(false);
      setUploadedVideos([...uploadedVideos, { title, description, previewUrls }]);
      setTitle('');
      setDescription('');
      setPreviewUrls([]);
      setSelectedFiles([]);
      loadingBarRef.current.complete();
    } catch (error) {
      setUploadMessage(error.response ? error.response.data.error : 'Failed to upload videos');
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="video-upload-container">
      <LoadingBar
        ref={loadingBarRef}
        height={8} // Increase the height
        colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']} // Rainbow colors
      />
      {uploadedVideos.map((video, index) => (
        <div key={index} className="video-info-box">
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          {video.previewUrls.map((url, idx) => (
            <video key={idx} src={url} controls className="video-preview" />
          ))}
        </div>
      ))}
      <button onClick={() => setShowPopup(true)}>Add Video</button>
      {showPopup && (
        <div className="video-upload-box">
          <div className="popup-content">
            <h2>Upload Profile Videos</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  value={title}
                  placeholder="Enter your title (Max 30 words)"
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength="30"
                />
              </label>
              <label>
                Description:
                <textarea
                  value={description}
                  placeholder="Enter description (100-120 words)"
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength="120"
                />
              </label>
              <input type="file" accept="video/*" multiple onChange={handleFileChange} />
              {previewUrls.map((url, index) => (
                <video key={index} src={url} controls className="video-preview" />
              ))}
              <div className="button-group">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default VideoUploadBox;
