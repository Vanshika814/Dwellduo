package com.dwellduo.dto;

import com.dwellduo.entity.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Message entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

    private Long id;

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private Long senderId;
    private String senderName;
    private String receiverName;

    @NotBlank(message = "Message content is required")
    private String content;

    private Message.MessageType messageType;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String attachmentUrl;
    private LocalDateTime createdAt;
}



