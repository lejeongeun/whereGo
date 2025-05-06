package org.project.wherego.websocket.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String message) {
        log.info("알림 전송 메시지 : {} ", message);
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
    public void sendNotificationToUser(String receiverEmail, String message) {
        log.info("🔔 {}에게 알림 전송: {}", receiverEmail, message);
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverEmail, message);
    }
}
