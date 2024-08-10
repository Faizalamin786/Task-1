import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import './Login.css';

const Login = () => {
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    loadingBarRef.current.continuousStart(); // Start loading bar

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { firstname, password });

      if (response.status === 200) {
        loadingBarRef.current.complete(); // Complete loading bar
        toast.success('Login successful');

        // Delay the navigation by 2 seconds
        setTimeout(() => {
          navigate('/page1', { state: { user: response.data.user } }); // Pass user data
        }, 2000);
      } else {
        loadingBarRef.current.complete(); // Complete loading bar
        toast.error('First name and password do not match');
      }
    } catch (error) {
      loadingBarRef.current.complete(); // Complete loading bar
      toast.error('First name and password do not match');
    }
  };

  return (
    <div className="login-container">
      <LoadingBar color="#f11946" ref={loadingBarRef} height={8} />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default Login;
