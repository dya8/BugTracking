import React from "react";
import { Card, CardContent, TextField, Button } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const ChatRoom = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Chat Room</h2>
        <Card>
          <CardContent>
            <TextField label="Type your message" variant="outlined" fullWidth />
            <Button variant="contained" color="primary" className="mt-2">Send</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ChatRoom;
