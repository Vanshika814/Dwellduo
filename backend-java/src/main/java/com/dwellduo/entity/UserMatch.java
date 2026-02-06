package com.dwellduo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * UserMatch Entity - Stores compatibility matches between users
 */
@Entity
@Table(name = "user_matches",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user1_id", "user2_id"}),
       indexes = {
           @Index(name = "idx_user1", columnList = "user1_id"),
           @Index(name = "idx_user2", columnList = "user2_id"),
           @Index(name = "idx_compatibility_score", columnList = "compatibility_score")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "compatibility_score", nullable = false)
    private Double compatibilityScore;

    @Column(name = "preference_score")
    private Double preferenceScore;

    @Column(name = "game_score")
    private Double gameScore;

    @Column(name = "lifestyle_score")
    private Double lifestyleScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "match_status")
    @Builder.Default
    private MatchStatus matchStatus = MatchStatus.PENDING;

    @Column(name = "user1_liked")
    @Builder.Default
    private Boolean user1Liked = false;

    @Column(name = "user2_liked")
    @Builder.Default
    private Boolean user2Liked = false;

    @Column(name = "user1_viewed")
    @Builder.Default
    private Boolean user1Viewed = false;

    @Column(name = "user2_viewed")
    @Builder.Default
    private Boolean user2Viewed = false;

    @Column(name = "matched_at")
    private LocalDateTime matchedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum MatchStatus {
        PENDING, MATCHED, REJECTED, EXPIRED
    }

    /**
     * Check if both users have liked each other (mutual match)
     */
    public boolean isMutualMatch() {
        return user1Liked && user2Liked;
    }
}



