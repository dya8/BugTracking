import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './test1';
import  Login  from './test2'
import './App.css'
import SignupPage from './Pages/SignupPage';
import TeamSignupPage from './Pages/TeamSignupPage';
import LoginPage from './Pages/LoginPage';
import WelcomePage from './Pages/WelcomePage';
function App() {
  
  return (
<Router>
      <Routes>
       <Route path="/" element={<WelcomePage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/team" element={<TeamSignupPage/>} />
     <Route path="/login" element={<LoginPage/>} />
     </Routes>
       </Router>
  )
}

export default App
