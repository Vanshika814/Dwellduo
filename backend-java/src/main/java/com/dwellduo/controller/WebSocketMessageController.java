package com.dwellduo.controller;

import com.dwellduo.dto.MessageDto;
import com.dwellduo.entity.User;
import com.dwellduo.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

/**
 * WebSocket Controller for real-time messaging
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    /**
     * Send private message to specific user
     */
    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload MessageDto messageDto,
            Authentication authentication
    ) {
        try {
            User sender = (User) authentication.getPrincipal();
            log.info("WebSocket message from {} to {}", sender.getId(), messageDto.getReceiverId());

            // Save message to database
            MessageDto savedMessage = messageService.sendMessage(sender.getId(), messageDto);

            // Send to receiver via WebSocket
            messagingTemplate.convertAndSendToUser(
                    messageDto.getReceiverId().toString(),
                    "/queue/messages",
                    savedMessage
            );

            // Send confirmation to sender
            messagingTemplate.convertAndSendToUser(
                    sender.getId().toString(),
                    "/queue/messages",
                    savedMessage
            );

        } catch (Exception e) {
            log.error("Error sending WebSocket message", e);
        }
    }

    /**
     * User connected notification
     */
    @MessageMapping("/chat.connect")
    @SendTo("/topic/user.connect")
    public String userConnect(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("User connected via WebSocket: {}", user.getId());
        return "User " + user.getName() + " connected";
    }

    /**
     * User disconnected notification
     */
    @MessageMapping("/chat.disconnect")
    @SendTo("/topic/user.disconnect")
    public String userDisconnect(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("User disconnected from WebSocket: {}", user.getId());
        return "User " + user.getName() + " disconnected";
    }

    /**
     * Typing indicator
     */
    @MessageMapping("/chat.typing")
    public void userTyping(
            @Payload Long receiverId,
            Authentication authentication
    ) {
        User sender = (User) authentication.getPrincipal();
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/typing",
                sender.getName() + " is typing..."
        );
    }
}



