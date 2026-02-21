package com.dwellduo.service;

import com.dwellduo.dto.UserDto;
import com.dwellduo.dto.UserMatchDto;
import com.dwellduo.entity.*;
import com.dwellduo.exception.BadRequestException;
import com.dwellduo.exception.ResourceNotFoundException;
import com.dwellduo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for matching algorithm and match management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MatchingService {

    private final UserMatchRepository userMatchRepository;
    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserGameAnswerRepository userGameAnswerRepository;
    private final GameQuestionRepository gameQuestionRepository;

    /**
     * Get matches for a user
     */
    @Cacheable(value = "userMatches", key = "#userId")
    public List<UserMatchDto> getMatchesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<UserMatch> matches = userMatchRepository.findMatchesByUserId(userId);
        
        return matches.stream()
                .map(match -> mapToDto(match, userId))
                .collect(Collectors.toList());
    }

    /**
     * Get top matches for a user
     */
    public List<UserMatchDto> getTopMatches(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<UserMatch> matches = userMatchRepository.findTopMatchesForUser(
                userId, 
                PageRequest.of(0, limit)
        );
        
        return matches.stream()
                .map(match -> mapToDto(match, userId))
                .collect(Collectors.toList());
    }

    /**
     * Get mutual matches for a user
     */
    public List<UserMatchDto> getMutualMatches(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<UserMatch> matches = userMatchRepository.findMutualMatchesByUser(userId);
        
        return matches.stream()
                .map(match -> mapToDto(match, userId))
                .collect(Collectors.toList());
    }
    public List<UserDto> findNearbyUsers(double lat, double lng, double radius) {
        List<Object[]> results = userRepository.findNearbyUsers(lat, lng, radius);
        return results.stream()
                .map(row -> {
                    Long userId = ((Number) row[0]).longValue();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    return mapUserToDto(user);
                })
                .toList();
    }
    

    /**
     * Like/Unlike a match
     */
    @CacheEvict(value = "userMatches", key = "#userId")
    public UserMatchDto toggleLike(Long userId, Long matchedUserId) {
        UserMatch match = userMatchRepository.findMatchBetweenUsers(userId, matchedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        // Determine which user is liking
        boolean isUser1 = match.getUser1().getId().equals(userId);
        
        if (isUser1) {
            match.setUser1Liked(!match.getUser1Liked());
        } else {
            match.setUser2Liked(!match.getUser2Liked());
        }

        // Check if it's a mutual match
        if (match.isMutualMatch()) {
            match.setMatchStatus(UserMatch.MatchStatus.MATCHED);
            match.setMatchedAt(LocalDateTime.now());
            log.info("Mutual match created between users: {} and {}", userId, matchedUserId);
        }

        UserMatch savedMatch = userMatchRepository.save(match);
        return mapToDto(savedMatch, userId);
    }

    /**
     * Calculate compatibility score between two users
     * This is a simplified version - expand based on your algorithm
     */
    public double calculateCompatibilityScore(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user1Id));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user2Id));

        double preferenceScore = calculatePreferenceScore(user1, user2);
        double gameScore = calculateGameScore(user1Id, user2Id);
        double lifestyleScore = calculateLifestyleScore(user1, user2);

        // Weighted average
        double totalScore = (preferenceScore * 0.3) + (gameScore * 0.5) + (lifestyleScore * 0.2);
        
        log.debug("Compatibility score between {} and {}: {}", user1Id, user2Id, totalScore);
        return Math.round(totalScore * 100.0) / 100.0;
    }

    /**
     * Calculate preference-based score
     */
    private double calculatePreferenceScore(User user1, User user2) {
        // Basic preference matching
        double score = 100.0;

        // Age preference
        if (user1.getAge() != null && user2.getAge() != null) {
            int ageDiff = Math.abs(user1.getAge() - user2.getAge());
            if (ageDiff > 10) score -= 15;
            else if (ageDiff > 5) score -= 10;
        }

        // Budget compatibility
        if (user1.getBudgetMax() != null && user2.getBudgetMin() != null) {
            if (user1.getBudgetMax() < user2.getBudgetMin() || user2.getBudgetMax() < user1.getBudgetMin()) {
                score -= 20;
            }
        }

        return Math.max(0, score);
    }

    /**
     * Calculate game-based score
     */
    private double calculateGameScore(Long user1Id, Long user2Id) {
        List<UserGameAnswer> user1Answers = userGameAnswerRepository.findByUserId(user1Id);
        List<UserGameAnswer> user2Answers = userGameAnswerRepository.findByUserId(user2Id);

        if (user1Answers.isEmpty() || user2Answers.isEmpty()) {
            return 50.0; // Default score if no answers
        }

        long matchingAnswers = user1Answers.stream()
                .filter(a1 -> user2Answers.stream()
                        .anyMatch(a2 -> a2.getQuestion().getId().equals(a1.getQuestion().getId()) 
                                && a2.getAnswer().equals(a1.getAnswer())))
                .count();

        return (matchingAnswers * 100.0) / user1Answers.size();
    }

    /**
     * Calculate lifestyle-based score
     */
    private double calculateLifestyleScore(User user1, User user2) {
        // Simplified lifestyle score
        double score = 100.0;

        // City compatibility
        if (user1.getCurrentCity() != null && user2.getCurrentCity() != null) {
            if (!user1.getCurrentCity().equalsIgnoreCase(user2.getCurrentCity())) {
                score -= 30;
            }
        }

        return Math.max(0, score);
    }

    // Mapper methods
    private UserMatchDto mapToDto(UserMatch match, Long currentUserId) {
        boolean isUser1 = match.getUser1().getId().equals(currentUserId);
        User matchedUser = isUser1 ? match.getUser2() : match.getUser1();
        boolean liked = isUser1 ? match.getUser1Liked() : match.getUser2Liked();
        boolean viewed = isUser1 ? match.getUser1Viewed() : match.getUser2Viewed();

        return UserMatchDto.builder()
                .id(match.getId())
                .matchedUser(mapUserToDto(matchedUser))
                .compatibilityScore(match.getCompatibilityScore())
                .preferenceScore(match.getPreferenceScore())
                .gameScore(match.getGameScore())
                .lifestyleScore(match.getLifestyleScore())
                .matchStatus(match.getMatchStatus())
                .liked(liked)
                .viewed(viewed)
                .mutualMatch(match.isMutualMatch())
                .matchedAt(match.getMatchedAt())
                .createdAt(match.getCreatedAt())
                .build();
    }

    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .age(user.getAge())
                .gender(user.getGender())
                .currentCity(user.getCurrentCity())
                .build();
    }
}



