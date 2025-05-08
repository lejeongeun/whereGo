import React from 'react';

import './NotificationPage.css';

const NotificationPage = ({ messages }) => {
    return (
        <div className="notification-page">
            <h2 className="notification-title">실시간 알림</h2>
            {messages.length === 0 ? (
                <p className="notification-empty">아직 알림이 없습니다.</p>
            ) : (
                <ul className="notification-list">
                    {messages.map((msg, index) => (
                        <li key={index} className="notification-item">
                            <span className="notification-text"> {msg}</span>
                            {index !== messages.length - 1 && <hr className="notification-divider" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationPage;
