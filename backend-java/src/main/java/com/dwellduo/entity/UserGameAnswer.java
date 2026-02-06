package com.dwellduo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * UserGameAnswer Entity - Stores user's answers to game questions
 */
@Entity
@Table(name = "user_game_answers", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "question_id"}),
       indexes = {
           @Index(name = "idx_user_question", columnList = "user_id, question_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGameAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private GameQuestion question;

    @Column(nullable = false)
    private String answer;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}



