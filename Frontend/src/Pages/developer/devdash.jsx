import React from "react";
import { Card, CardContent } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Devdashboard = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <div className="p-6 grid grid-cols-2 gap-4">
        <Card><CardContent>Bug Status</CardContent></Card>
        <Card><CardContent>Project Overview</CardContent></Card>
        <Card><CardContent>My Bug Stats</CardContent></Card>
        <Card><CardContent>Leaderboard/Activity Log</CardContent></Card>
        <Card><CardContent>Notifications</CardContent></Card>
      </div>
    </div>
  </div>
);

export default Devdashboard;
