import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewChecklistPage from './pages/NewChecklistPage';
import EditChecklistPage from './pages/EditChecklistPage';
import ChecklistPage from './pages/ChecklistPage';
// import AuthPage from './pages/AuthPage';
// import TripPage from './pages/TripPage';
// import ExpensePage from './pages/ExpensePage';
// import ProfilePage from './pages/ProfilePage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import CommunityDetailPage from './pages/community/CommunityDetailPage';
import CommunityWritePage from './pages/community/CommunityWritePage';
import CommunityPage from './pages/community/CommunityPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <div className="main-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/checklist/new" element={<NewChecklistPage />} />
            <Route path="/checklist/edit" element={<EditChecklistPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage />} />
            <Route path="/community/write" element={<CommunityWritePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;