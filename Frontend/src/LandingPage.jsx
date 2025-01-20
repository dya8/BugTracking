import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landing from './assets/landing.svg'
import './LandingPage.css'; // For custom styling
/*import register from './Register';
import dashboard from './Dashboard';*/

const LandingPage = () => {
  const [isSwiped, setIsSwiped] = useState(false); // Track swipe state
  const navigate = useNavigate();
  
  // Check user login status (replace this with actual login status logic)
  const isLoggedIn = false; // Change based on actual login logic

  const handleSwipe = () => {
    setIsSwiped(true);
    if (!isLoggedIn) {
      navigate('/register'); // Redirect to register if not logged in
    } else {
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  };

  const handleSignIn = () => {
    // Redirect to registration or sign-in page
    navigate('/');
  };

  return (
    <>
    <div className="main" style={{background: 'linear-gradient(135deg, #ffffff 10%, #f5f5f5 100%)', justifyContent: 'space-between',alignItems: 'center', padding: '100px 50px',backgroundColor: '#f5f5f5',}}>
    <div className="home-container" style={{background: 'linear-gradient(135deg, #ffffff 30%, #f5f5f5 100%)',width:'100%',display:'flex',justifyContent:'space-around'}}>
     
        <div className="logo" >CourseCo</div>
        < nav style={{display:'flex',justifyContent:'space-around'}}>
         
          <button className="sign-in-btn" onClick={handleSignIn}>Sign In</button>
        </nav>
 
      </div>
      <div className="hero-section" style={{background: 'linear-gradient(135deg, #ffffff 30%, #f5f5f5 100%)', display: 'flex', justifyContent: 'space-between',alignItems: 'center', padding: '100px 50px',backgroundColor: '#f5f5f5',}}>
        <div className="content">
        <h1 style={{fontSize: '3rem', color: '#3a0b00', marginBottom: '20px'}}>Master New Skills with CourseCo </h1>
        <p style={{ fontSize: '1.2rem',color: '#5a5a5a',marginBottom: '30px',}}>Are you tired of pulling all-nighters and still struggling to keep up with your coursework?</p>
        <div className="swipe-to-get-started">
          <button
            className={`get-started-btn ${isSwiped ? 'swiped' : ''}`}
            onClick={handleSwipe}
          >
            Get Started
          </button>
          <p>Swipe to the right</p>
        </div>

        <div className="use',}}>Mar-count">
          <span>42k +</span> <p>Using this app</p>
        </div>
        </div>
        <div className="image" style={{ flexGrow: 1, display: 'flex',justifyContent: 'center'}}>
            <img src={landing} alt="Home" style={{ width: '600px',height:'auto'}}/> 
        </div>
        </div>
</div>
    </>
  );
};

export default LandingPage;
