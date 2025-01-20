import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import loginImage from './assets/loginImage.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      if (response.data.success) {
        alert('Login successful');
        //navigate('/home'); // Redirect to the home page
        navigate('/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImage} alt="Login" />
      </div>
      <div className="login-form">
        <h1>Welcome Developer</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <p>Don't have an account? <Link to="/LandingPage">Login</Link></p>
        </form>
     {/*   <p>Don't have an account? <Link to="/register">Register here</Link></p>
  */ }   </div>
    </div>
  );
}

export default Login;
