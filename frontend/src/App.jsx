import React from "react";
import './App.css'
import { Routes, Route } from "react-router-dom";import HackathonForm from "./components/HackathonForm";
import QRCodeGenerator from "./components/QrCodeGenerator";
import { QrCode } from "lucide-react";



function App() {


  return (
    <Routes>
      <Route path="/" element={<HackathonForm/>} />
      <Route path="/qr" element={<QRCodeGenerator />} />
      
      
    </Routes>

    
  )
}

export default App
