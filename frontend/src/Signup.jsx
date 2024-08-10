import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import './Signup.css';

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !number) {
      toast.error('Please fill in all fields');
      return;
    }

    if (number.length !== 10 || !/^\d+$/.test(number)) {
      toast.error('Phone number must be exactly 10 digits long');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    loadingBarRef.current.continuousStart(); // Start loading bar

    try {
      await axios.post('http://localhost:5000/api/auth/register', { firstname, lastname, email, number });
      loadingBarRef.current.complete(); // Complete loading bar
      toast.success('User created successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      loadingBarRef.current.complete(); // Complete loading bar
      toast.error('Error creating user');
    }
  };

  return (
    <div className='login-container'>
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      <form onSubmit={handleSubmit} className='login-form'>
        <h2>SignUp</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default Signup;
