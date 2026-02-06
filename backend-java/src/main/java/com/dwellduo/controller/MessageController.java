package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
import com.dwellduo.dto.MessageDto;
import com.dwellduo.entity.User;
import com.dwellduo.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Messaging
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    /**
     * Send a message
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            Authentication authentication,
            @Valid @RequestBody MessageDto messageDto
    ) {
        User user = (User) authentication.getPrincipal();
        MessageDto sentMessage = messageService.sendMessage(user.getId(), messageDto);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", sentMessage));
    }

    /**
     * Get conversation with another user
     */
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversation(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        User user = (User) authentication.getPrincipal();
        List<MessageDto> messages = messageService.getConversation(user.getId(), userId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get unread messages
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getUnreadMessages(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<MessageDto> messages = messageService.getUnreadMessages(user.getId());
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get unread message count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        long count = messageService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * Mark message as read
     */
    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            Authentication authentication,
            @PathVariable Long messageId
    ) {
        User user = (User) authentication.getPrincipal();
        messageService.markMessageAsRead(messageId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
    }

    /**
     * Mark all messages in conversation as read
     */
    @PutMapping("/conversation/{userId}/read")
    public ResponseEntity<ApiResponse<Void>> markConversationAsRead(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        User user = (User) authentication.getPrincipal();
        messageService.markConversationAsRead(user.getId(), userId);
        return ResponseEntity.ok(ApiResponse.success("Conversation marked as read", null));
    }

    /**
     * Get list of conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Long>>> getUserConversations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Long> conversations = messageService.getUserConversations(user.getId());
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }
}



