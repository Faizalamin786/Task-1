import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Page1 from './components/Page1/Page1'; // Import the Page1 component
import UserListing from './components/user-listing/UserListing';
import UserVideos from './components/userVideo/UserVideo';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/page1" element={<Page1/>} /> 
        <Route path='/userListing' element={<UserListing/>}/>
        <Route path="/users/:username" element={<UserVideos/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
