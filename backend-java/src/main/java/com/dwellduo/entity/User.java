package com.dwellduo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.messaging.simp.user.DestinationUserNameProvider;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

/**
 * User Entity - Represents a user in the DwellDuo platform
 * Implements Spring Security UserDetails for authentication
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    // @Index(name = "idx_clerk_id", columnList = "clerk_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails, DestinationUserNameProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    // @Column(name = "clerk_id", unique = true)
    // private String clerkId;

    @Column(nullable = false)
    private String name;

    @Column(name = "profile_image")
    private String profileImage;

    private String bio;

    @Column(name = "phone_number")
    private String phoneNumber;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "current_city")
    private String currentCity;

    @Column(name = "move_in_date")
    private LocalDateTime moveInDate;

    @Column(name = "budget_min")
    private Integer budgetMin;

    @Column(name = "budget_max")
    private Integer budgetMax;

    // Roommate preferences
    private String budget;
    
    @Column(name = "location_preference")
    private String locationPreference;
    
    @Column(name = "gender_preference")
    private String genderPreference;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    @Builder.Default
    private Role role = Role.USER;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "profile_completed")
    @Builder.Default
    private Boolean profileCompleted = false;

    @Column(columnDefinition = "text")
    private String location;

    /**
     * Extract latitude from location POINT string
     * POINT format: "POINT(longitude latitude)"
     * Defensive: never throws (handles non-String location from DB or parse errors).
     */
    public Double getLatitude() {
        try {
            if (location == null) return null;
            String loc = location instanceof String ? (String) location : String.valueOf(location);
            if (loc.isEmpty()) return null;
            String coords = loc.replace("POINT(", "").replace(")", "");
            String[] parts = coords.trim().split("\\s+");
            if (parts.length >= 2) {
                return Double.parseDouble(parts[1]); // latitude is second
            }
        } catch (Exception ignored) {
            // return null on any parse or type error
        }
        return null;
    }

    /**
     * Extract longitude from location POINT string
     * POINT format: "POINT(longitude latitude)"
     * Defensive: never throws.
     */
    public Double getLongitude() {
        try {
            if (location == null) return null;
            String loc = location instanceof String ? (String) location : String.valueOf(location);
            if (loc.isEmpty()) return null;
            String coords = loc.replace("POINT(", "").replace(")", "");
            String[] parts = coords.trim().split("\\s+");
            if (parts.length >= 2) {
                return Double.parseDouble(parts[0]); // longitude is first
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    // @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private UserPreference preferences;

    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<UserGameAnswer> gameAnswers = new HashSet<>();

    // @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL)
    // private Set<UserMatch> matchesAsUser1 = new HashSet<>();

    // @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL)
    // private Set<UserMatch> matchesAsUser2 = new HashSet<>();

    // @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    // private Set<Message> sentMessages = new HashSet<>();

    // @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    // private Set<Message> receivedMessages = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Spring Security UserDetails Implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getPassword() {
        // Using Clerk for authentication, no password stored
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Used by Spring WebSocket to resolve /user/queue/* destinations so that
     * convertAndSendToUser(userId, ...) delivers to this user's session.
     */
    @Override
    public String getDestinationUserName() {
        return id != null ? id.toString() : "";
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    public enum Gender {
        MALE, FEMALE, NON_BINARY, PREFER_NOT_TO_SAY
    }

    public enum Role {
        USER, ADMIN
    }
}


