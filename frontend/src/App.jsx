import React from "react";
import './App.css'
import { Routes, Route } from "react-router-dom";import HackathonForm from "./components/HackathonForm";
import QRCodeGenerator from "./components/QrCodeGenerator";
import ParticipantsList from "./components/ParticipantsList";



function App() {


  return (
    <Routes>
      <Route path="/" element={<HackathonForm/>} />
      <Route path="/qr" element={<QRCodeGenerator />} />
      <Route path="/List" element={<ParticipantsList/>}/>
      
      
    </Routes>

    
  )
}

export default App
