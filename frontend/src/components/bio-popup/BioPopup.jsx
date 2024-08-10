import React, { useState } from 'react';
import './BioPopup.css'; // Create appropriate styling for the popup

const BioPopup = ({ onClose, onSave }) => {
  const [bio, setBio] = useState('');

  const handleSave = () => {
    if (bio.length <= 500) {
      onSave(bio);
    } else {
      alert('Bio cannot exceed 500 characters.');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h1>Add Bio</h1>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          placeholder="Enter your bio (400-500 characters)"
        ></textarea>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BioPopup;
