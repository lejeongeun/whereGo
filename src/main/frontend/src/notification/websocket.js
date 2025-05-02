//import { Client } from '@stomp/stompjs';
//import SockJS from 'sockjs-client';
//
//const connectWebSocket = (onMessageReceived) => {
//  const socket = new SockJS('http://localhost:8080/ws'); // 백엔드 연결
//  const client = new Client({
//    webSocketFactory: () => socket,
//    onConnect: () => {
//      console.log('웹소켓 연결 완료!');
//      client.subscribe('/topic/notifications', (message) => {
//        onMessageReceived(JSON.parse(message.body));
//      });
//    },
//    debug: function (str) {
//      console.log(str);
//    },
//  });
//
//  client.activate();
//  return client;
//};
//
//export default connectWebSocket;