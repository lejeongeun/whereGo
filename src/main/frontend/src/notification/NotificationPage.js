<<<<<<< Updated upstream
import React from 'react';

import './NotificationPage.css'; // 스타일은 유지

const NotificationPage = ({ messages }) => {
    return (
        <div className="notification-page">
            <h2 className="notification-title">🔔 실시간 알림</h2>
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
=======
// import React, { useEffect, useState } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// const NotificationPage = () => {
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         const socket = new SockJS('http://localhost:8080/ws'); // SockJS 사용
//         const client = new Client({
//             webSocketFactory: () => socket, // ✅ 변경: SockJS로 연결
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 console.log('✅ WebSocket 서버 연결 성공');
//                 client.subscribe('/topic/notifications', (message) => {
//                     console.log('✅ 알림 수신:', message.body);
//                     setMessages(prevMessages => [...prevMessages, message.body]);
//                 });
//             },
//             debug: (str) => {
//                 console.log(str);
//             },
//         });

//         client.activate();

//         return () => {
//             client.deactivate();
//         };
//     }, []);

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>🔔 실시간 알림</h2>
//             {messages.length === 0 ? (
//                 <p>아직 알림이 없습니다.</p>
//             ) : (
//                 <ul>
//                     {messages.map((msg, index) => (
//                         <li key={index}>📢 {msg}</li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };
>>>>>>> Stashed changes

// export default NotificationPage;