import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import  Login  from './Login'
import './App.css'

function App() {
  
  return (
<Router>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/LandingPage" element={<LandingPage/>} />
       </Routes>
       </Router>
  )
}

export default App
