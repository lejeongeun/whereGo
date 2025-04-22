import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
// import AuthPage from './pages/AuthPage';
// import TripPage from './pages/TripPage';
// import ExpensePage from './pages/ExpensePage';
// import CommunityPage from './pages/CommunityPage';
// import ChecklistPage from './pages/ChecklistPage';
// import ProfilePage from './pages/ProfilePage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-container">
          <Navbar className="navbar" />
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer className="footer" />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
