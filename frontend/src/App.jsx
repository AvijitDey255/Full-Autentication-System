import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from './pages/LoginPage';
function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App