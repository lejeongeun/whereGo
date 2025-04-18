import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import AuthPage from './pages/AuthPage';
// import TripPage from './pages/TripPage';
// import ExpensePage from './pages/ExpensePage';
// import CommunityPage from './pages/CommunityPage';
// import ChecklistPage from './pages/ChecklistPage';
// import ProfilePage from './pages/ProfilePage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/auth" element={<AuthPage />} />
            <Route path="/trips" element={<TripPage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/profile" element={<ProfilePage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
