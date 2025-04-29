import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import ChecklistPage from './pages/checklist/ChecklistPage';
import NewChecklistPage from './pages/checklist/NewChecklistPage';
import EditChecklistPage from './pages/checklist/EditChecklistPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import FindPwd from './components/auth/FindPwd';
import Exchange from './pages/exchange/Exchange';
import CommunityDetailPage from './pages/community/CommunityDetailPage';
import CommunityWritePage from './pages/community/CommunityWritePage';
import CommunityPage from './pages/community/CommunityPage';
import TripSchedulePage from './pages/schedule/TripSchedulePage';
import WeatherWorld from './pages/weatherWorld/WeatherWorld';
import MyPage from './pages/mypage/Mypage';
import ChangePwd from './pages/mypage/ChangePwd';
import './App.css';
import CommunityEditPage from './pages/community/CommunityEditPage';
import MapContainer from './components/schedule/MapContainer';
import NotificationPage from './notification/NotificationPage';

function App() {
  return (
      <BrowserRouter>
        <div className="app-layout">
          
          <div className="main-container">
            <Navbar className="navbar" />
            <div className="content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/findPwd" element={<FindPwd />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/map" element={<MapContainer />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/checklist/new" element={<NewChecklistPage />} />
                <Route path="/checklist/edit" element={<EditChecklistPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/:id" element={<CommunityDetailPage />} />
                <Route path="/community/write" element={<CommunityWritePage />} />
                <Route path="/schedule" element={<TripSchedulePage />} />
                <Route path="/community/:id/edit" element={<CommunityEditPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/changePwd" element={<ChangePwd />} />
                <Route path="/weather" element={<WeatherWorld />} /> 
                <Route path='/notification' element={<NotificationPage />} />
              </Routes>
            </div>
            <Footer className="footer" />
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;