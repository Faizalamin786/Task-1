import React, { useState, useRef } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import './ImageUploadBox.css';

const ImageUploadBox = ({ firstname }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const loadingBarRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) { // Ensure file size is less than or equal to 1MB
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadMessage('');
    } else {
      setUploadMessage('File size should be less than 1MB');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    formData.append('firstname', firstname);

    try {
      loadingBarRef.current.continuousStart();
      const response = await axios.post('http://localhost:5000/api/auth/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          loadingBarRef.current.set(percentCompleted);
        }
      });
      setUploadMessage(response.data.message);
      loadingBarRef.current.complete();
    } catch (error) {
      setUploadMessage(error.response ? error.response.data.error : 'Failed to upload image');
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="image-upload-box">
      <LoadingBar
        ref={loadingBarRef}
        height={8} // Increase the height
        colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']} // Rainbow colors
      />
      <h2>Upload Profile Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
        <button type="submit">Upload</button>
      </form>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default ImageUploadBox;
