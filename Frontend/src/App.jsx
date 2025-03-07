import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './test1';
import  Login  from './test2'
import './App.css'
import SignupPage from './Pages/SignupPage';
import CompanySignin from './Pages/CompanySignin';
import ProjectSignin from './Pages/ProjectSignin';
import TeamSignupPage from './Pages/TeamSignupPage';
import LoginPage from './Pages/LoginPage';
import WelcomePage from './Pages/WelcomePage';
import LoadingPage from './Pages/LoadingPage';
import ManageUsers from './Pages/admin/ManageUsers';
import Test from './Pages/admin/CurrentProjects';
import Setting from './Pages/admin/Setting';
function App() {
  
  return (
<Router>
      <Routes>
       <Route path="/" element={<WelcomePage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/team" element={<TeamSignupPage/>} />
      <Route path="/team" element={<TeamSignupPage/>} />
      <Route path="/companylogin" element={<CompanySignin/>} />
      <Route path="/projectlogin" element={<ProjectSignin/>} />
      <Route path="/loading" element={<LoadingPage/>} />
     <Route path="/login" element={<LoginPage/>} />
     <Route path="/admin" element={<ManageUsers/>} />
      <Route path="/test" element={<Test/>} />
      <Route path="/setting" element={<Setting/>} />
     </Routes>
       </Router>
  )
}

export default App
