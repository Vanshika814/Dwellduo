package com.dwellduo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * GameQuestion Entity - Compatibility game questions
 */
@Entity
@Table(name = "game_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_a_image_url")
    private String optionAImageUrl;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_b_image_url")
    private String optionBImageUrl;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_c_image_url")
    private String optionCImageUrl;


    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "weight", nullable = false)
    @Builder.Default
    private Integer weight = 1;

    @Column(name = "category")
    private String category;

    @Column(name = "display_order")
    private Integer displayOrder;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserGameAnswer> userAnswers = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum QuestionType {
        MULTIPLE_CHOICE, YES_NO, SCALE, TEXT, IMAGE_CHOICE
    }
}



