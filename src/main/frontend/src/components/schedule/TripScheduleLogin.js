import React from 'react';
import Login from '../auth/Login';
import './schedule.css';

function TripScheduleLogin({ isLoginFormOpen, setIsLoginFormOpen, setIsLoggedIn }) {
  return (
    <>
      {isLoginFormOpen ? (
        <Login 
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setIsLoginFormOpen(false);
          }} 
        />
      ) : (
        <div className="login-prompt">
          <div className="login-message">로그인을 해주세요</div>
          <button 
            className="login-button"
            onClick={() => setIsLoginFormOpen(true)}
          >
            로그인
          </button>
        </div>
      )}
    </>
  );
}

export default TripScheduleLogin; 