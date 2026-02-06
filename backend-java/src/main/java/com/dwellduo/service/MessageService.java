package com.dwellduo.service;

import com.dwellduo.dto.MessageDto;
import com.dwellduo.entity.Message;
import com.dwellduo.entity.User;
import com.dwellduo.exception.ResourceNotFoundException;
import com.dwellduo.repository.MessageRepository;
import com.dwellduo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for messaging between matched users
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    /**
     * Send a message
     */
    public MessageDto sendMessage(Long senderId, MessageDto messageDto) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));
        
        User receiver = userRepository.findById(messageDto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", messageDto.getReceiverId()));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(messageDto.getContent())
                .messageType(messageDto.getMessageType() != null ? messageDto.getMessageType() : Message.MessageType.TEXT)
                .attachmentUrl(messageDto.getAttachmentUrl())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent from {} to {}", senderId, messageDto.getReceiverId());
        
        return mapToDto(savedMessage);
    }

    /**
     * Get conversation between two users
     */
    public List<MessageDto> getConversation(Long user1Id, Long user2Id) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(user1Id, user2Id);
        return messages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unread messages for a user
     */
    public List<MessageDto> getUnreadMessages(Long userId) {
        List<Message> messages = messageRepository.findUnreadMessagesByReceiver(userId);
        return messages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unread message count
     */
    public long getUnreadCount(Long userId) {
        return messageRepository.countUnreadMessagesByReceiver(userId);
    }

    /**
     * Mark message as read
     */
    public void markMessageAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));

        if (!message.getReceiver().getId().equals(userId)) {
            throw new ResourceNotFoundException("Message not found for this user");
        }

        message.markAsRead();
        messageRepository.save(message);
        log.info("Message {} marked as read", messageId);
    }

    /**
     * Mark all messages in conversation as read
     */
    public void markConversationAsRead(Long userId, Long otherUserId) {
        int updatedCount = messageRepository.markConversationAsRead(otherUserId, userId);
        log.info("Marked {} messages as read in conversation between {} and {}", 
                updatedCount, userId, otherUserId);
    }

    /**
     * Get user conversations (list of users they've chatted with)
     */
    public List<Long> getUserConversations(Long userId) {
        return messageRepository.findUserConversations(userId);
    }

    // Mapper method
    private MessageDto mapToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .senderName(message.getSender().getName())
                .receiverName(message.getReceiver().getName())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .isRead(message.getIsRead())
                .readAt(message.getReadAt())
                .attachmentUrl(message.getAttachmentUrl())
                .createdAt(message.getCreatedAt())
                .build();
    }
}



