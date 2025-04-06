import React from 'react';
import { useState } from 'react'; // Import useState for managing state
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
import Chatroom from './Pages/developer/Chatroom';
import ReportBug from './Pages/tester/ReportBug';
import Dashboard from './Pages/tester/Dashboard';
import ChatroomTester from './Pages/tester/ChatRoom';
import CurrentProjects from './Pages/tester/CurrentProject';
import Tester_Settings from './Pages/tester/Settings';
import Notifications from './Pages/admin/Noti';
import Settings from './Pages/developer/settings';
import Projects from './Pages/developer/Projects';
import AssignedBugs from './Pages/developer/Assignedbugs';
import BugDetails from './Pages/developer/BugDetails';
import BugDetailsM from './Pages/manager/Bugdetails';
import ManageTeam from './Pages/manager/ManageTeam';
import CurrProject from './Pages/manager/Currproject';
import TrackBugs from './Pages/manager/Trackbugs';
import ReportedBugs from './Pages/manager/Reportbugs';
import AssignDue from './Pages/manager/Assigndue';
import AssignDuePage from './Pages/manager/assignduepage';
import BugReport from './Pages/tester/reportedbugs';
import VerifyBugs from './Pages/tester/verifybug';
import VerifyBugDetails from './Pages/tester/verifybugdetails';
import Devdashboard from './Pages/developer/devdash';
import Admindashboard from './Pages/admin/admindash';
import Managerdashboard from './Pages/manager/managerdash';
import DevNotifications from './Pages/developer/Devnoti';
import ManNotifications from './Pages/manager/Manoti';
import TestNotifications from './Pages/tester/Notitester';
import ViewUser from './Pages/admin/viewuser';
import ProjectStats from './Pages/admin/ProjectStats';
import ProjectStatsT from './Pages/tester/ProjectStatsT';
import ProjectStatsD from './Pages/developer/ProjectStatsD';
import ProjectStatsM from './Pages/manager/ProjectStatsM';
import SettingsM from './Pages/manager/SettingsM';
function App() {
  const [userId, setUserId] = useState(null); // Store User ID
  const[testerId, setTesterId] = useState(null); // Store Tester ID
  const[adminId, setAdminId] = useState(null); // Store Admin ID
  const [managerId, setManagerId] = useState(null); // Store Manager ID

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
     <Route path="/admin" element={<ManageUsers adminId={adminId}/>} />
      <Route path="/test" element={<Test adminId={adminId}/>} />
      <Route path="/setting" element={<Setting adminId={adminId}/>} />
      <Route path="/report-bug" element={<ReportBug/>} />
      <Route path="/dashboard/:dashboardId" element={<Dashboard setTesterId={setTesterId}/>}/>
      {/*<Route path="/dashboard" element={<Dashboard/>} />*/}
      <Route path="/chat-room" element={<ChatroomTester />} />
      <Route path="/projects" element={<CurrentProjects testerId={testerId}/>} />
      <Route path="/tester-settings" element={<Tester_Settings testerId={testerId}/>}/>
      <Route path="/settings" element={<Settings userId={userId}/>} />
     {/* <Route path="/developer" element={<Settings/>} />*/}
       {/*Pass userid to projects*/ }
      <Route path="/project" element={<Projects userId={userId}/>} />
      <Route path="/assigned-bugs" element={<AssignedBugs userId={userId}/>} />
      <Route path="/bug-details/:id" element={<BugDetails/>} />
      <Route path="/chatroom" element={<Chatroom/>} />
      <Route path="/notifications" element={<Notifications/>} />
      <Route path="/trackbug/:id" element={<BugDetailsM/>} />
      <Route path="/manage-team" element={<ManageTeam managerId={managerId}/>}/>
      <Route path="/current-projects" element={<CurrProject managerId={managerId}/>}/>
      <Route path="/manager-settings" element={<SettingsM managerId={managerId}/>} />
      <Route path="/trackbugs" element={<TrackBugs/>}/>
      <Route path="/reported-bugs" element={<ReportedBugs/>}/>
      <Route path="/assign-due" element={<AssignDue/>}/>
      <Route path="/assign-due/bug/:id" element={<AssignDuePage/>} />
      <Route path="/reportedbugs" element={<BugReport/>}/>
      <Route path ="/verify-bugs" element={<VerifyBugs/>}/>
      <Route path ="/verify-bugs/:bugId" element={<VerifyBugDetails/>}/>
      {/*Pass setuserid to update userid in dashboard*/ }
      <Route path="/devdashboard/:dashboardId" element={<Devdashboard setUserId={setUserId}/>}/>
      <Route path="/admindashboard/:dashboardId" element={<Admindashboard setAdminId={setAdminId}/>}/>
      <Route path="/managerdashboard/:dashboardId" element={<Managerdashboard setManagerId={setManagerId}/>}/>
      <Route path="/devnotifications" element={<DevNotifications/>}/>
      <Route path="/manotifications" element={<ManNotifications/>}/>
      <Route path="/testnotifications" element={<TestNotifications/>}/>
      <Route path="/view-user/:userId/:role" element={<ViewUser />} /> 
      <Route path="/project-stats/:projectName" element={<ProjectStats />} />
      <Route path="/project-statsT/:projectName" element={<ProjectStatsT />} />
      <Route path="/project-statsD/:projectName" element={<ProjectStatsD />} />
      <Route path="/project-statsM/:projectName" element={<ProjectStatsM />} />
     </Routes>
       </Router>
  )
}

export default App
