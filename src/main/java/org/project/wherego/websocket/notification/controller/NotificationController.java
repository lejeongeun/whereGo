package org.project.wherego.websocket.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationController {
    @MessageMapping("/notify") // 클라이언트 -> 서버
    @SendTo("/topic/notification") // 서버 -> 클라이언트
    public String sendNotification(String message){
        return message;
    }

}
