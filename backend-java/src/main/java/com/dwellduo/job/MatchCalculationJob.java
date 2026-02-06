package com.dwellduo.job;

import com.dwellduo.entity.User;
import com.dwellduo.entity.UserMatch;
import com.dwellduo.repository.UserMatchRepository;
import com.dwellduo.repository.UserRepository;
import com.dwellduo.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Asynchronous job for calculating matches between users
 * Runs in background using @Async
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchCalculationJob {

    private final UserRepository userRepository;
    private final UserMatchRepository userMatchRepository;
    private final MatchingService matchingService;

    /**
     * Calculate matches for a specific user asynchronously
     */
    @Async
    @Transactional
    public void calculateMatchesForUser(Long userId) {
        log.info("Starting match calculation for user: {}", userId);
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.getProfileCompleted()) {
            log.warn("User {} not found or profile not completed", userId);
            return;
        }

        // Get all other active users with completed profiles
        List<User> potentialMatches = userRepository.findByProfileCompletedTrue().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(User::getIsActive)
                .toList();

        log.info("Found {} potential matches for user {}", potentialMatches.size(), userId);

        int newMatches = 0;
        int updatedMatches = 0;

        for (User potentialMatch : potentialMatches) {
            try {
                // Check if match already exists
                var existingMatch = userMatchRepository.findMatchBetweenUsers(userId, potentialMatch.getId());

                if (existingMatch.isPresent()) {
                    // Update existing match
                    UserMatch match = existingMatch.get();
                    double newScore = matchingService.calculateCompatibilityScore(userId, potentialMatch.getId());
                    match.setCompatibilityScore(newScore);
                    userMatchRepository.save(match);
                    updatedMatches++;
                } else {
                    // Create new match
                    double compatibilityScore = matchingService.calculateCompatibilityScore(userId, potentialMatch.getId());
                    
                    UserMatch newMatch = UserMatch.builder()
                            .user1(user)
                            .user2(potentialMatch)
                            .compatibilityScore(compatibilityScore)
                            .matchStatus(UserMatch.MatchStatus.PENDING)
                            .user1Liked(false)
                            .user2Liked(false)
                            .user1Viewed(false)
                            .user2Viewed(false)
                            .build();

                    userMatchRepository.save(newMatch);
                    newMatches++;
                }
            } catch (Exception e) {
                log.error("Error calculating match between {} and {}: {}", 
                        userId, potentialMatch.getId(), e.getMessage());
            }
        }

        log.info("Match calculation completed for user {}. New: {}, Updated: {}", 
                userId, newMatches, updatedMatches);
    }

    /**
     * Recalculate all matches for all users (scheduled job)
     */
    @Async
    @Transactional
    public void recalculateAllMatches() {
        log.info("Starting full match recalculation");
        
        List<User> activeUsers = userRepository.findByProfileCompletedTrue();
        log.info("Recalculating matches for {} users", activeUsers.size());

        for (User user : activeUsers) {
            try {
                calculateMatchesForUser(user.getId());
            } catch (Exception e) {
                log.error("Error calculating matches for user {}: {}", user.getId(), e.getMessage());
            }
        }

        log.info("Full match recalculation completed");
    }

    /**
     * Calculate matches between two specific users
     */
    @Async
    public void calculateMatchBetweenUsers(Long user1Id, Long user2Id) {
        log.info("Calculating match between users {} and {}", user1Id, user2Id);

        User user1 = userRepository.findById(user1Id).orElse(null);
        User user2 = userRepository.findById(user2Id).orElse(null);

        if (user1 == null || user2 == null) {
            log.warn("One or both users not found");
            return;
        }

        double compatibilityScore = matchingService.calculateCompatibilityScore(user1Id, user2Id);

        var existingMatch = userMatchRepository.findMatchBetweenUsers(user1Id, user2Id);

        if (existingMatch.isPresent()) {
            UserMatch match = existingMatch.get();
            match.setCompatibilityScore(compatibilityScore);
            userMatchRepository.save(match);
            log.info("Updated match between {} and {}: score={}", user1Id, user2Id, compatibilityScore);
        } else {
            UserMatch newMatch = UserMatch.builder()
                    .user1(user1)
                    .user2(user2)
                    .compatibilityScore(compatibilityScore)
                    .matchStatus(UserMatch.MatchStatus.PENDING)
                    .user1Liked(false)
                    .user2Liked(false)
                    .user1Viewed(false)
                    .user2Viewed(false)
                    .build();

            userMatchRepository.save(newMatch);
            log.info("Created new match between {} and {}: score={}", user1Id, user2Id, compatibilityScore);
        }
    }
}



