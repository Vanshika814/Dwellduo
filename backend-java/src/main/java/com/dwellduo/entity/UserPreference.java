package com.dwellduo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * UserPreference Entity - Stores user's roommate preferences
 */
@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_gender")
    private User.Gender preferredGender;

    @Column(name = "age_range_min")
    private Integer ageRangeMin;

    @Column(name = "age_range_max")
    private Integer ageRangeMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "cleanliness_level")
    private CleanlinessLevel cleanlinessLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "noise_tolerance")
    private NoiseLevel noiseTolerance;

    @Enumerated(EnumType.STRING)
    @Column(name = "guest_policy")
    private GuestPolicy guestPolicy;

    @Column(name = "smoking_allowed")
    @Builder.Default
    private Boolean smokingAllowed = false;

    @Column(name = "pets_allowed")
    @Builder.Default
    private Boolean petsAllowed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "sleep_schedule")
    private SleepSchedule sleepSchedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_schedule")
    private WorkSchedule workSchedule;

    @Column(name = "dietary_preferences")
    private String dietaryPreferences;

    @Column(name = "hobbies")
    private String hobbies;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CleanlinessLevel {
        VERY_CLEAN, MODERATELY_CLEAN, CASUAL, RELAXED
    }

    public enum NoiseLevel {
        VERY_QUIET, MODERATE, LIVELY, VERY_LIVELY
    }

    public enum GuestPolicy {
        NO_GUESTS, OCCASIONAL, FREQUENT, VERY_FREQUENT
    }

    public enum SleepSchedule {
        EARLY_BIRD, NIGHT_OWL, FLEXIBLE, IRREGULAR
    }

    public enum WorkSchedule {
        NINE_TO_FIVE, FLEXIBLE, NIGHT_SHIFT, STUDENT, FREELANCER
    }
}



