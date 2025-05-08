import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';
import GoogalLogo from './img/glogo.png';
import Logo from './img/logo.png';



function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error); //error showing
    }
  };

  return (
    <div className="login-page" >
      <div className="login-left" >
        <div className="brand-section" >
                        <img src={Logo} alt="Logo" className="login_logo"  />

          <h1 className="name">TekhneHive</h1>
          <p className="quote"> Share your skills with the hive!</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <h2>Sign In</h2>
          <p className="welcome-text">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="signin-btn">
                Sign In
              </button>
              
              <div className="separator">
                <span>or continue with</span>
              </div>

              <button 
                type="button" 
                className="google-signin"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              >
                <img src={GoogalLogo} alt="Google" />
                Google
              </button>
            </div>
          </form>

          <p className="register-link">
            New to BlogSpace? 
            <span onClick={() => window.location.href = '/register'}>
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
