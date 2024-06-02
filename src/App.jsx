import { useState } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default App
