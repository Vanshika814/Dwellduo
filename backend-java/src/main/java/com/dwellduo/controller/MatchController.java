package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
import com.dwellduo.dto.UserMatchDto;
import com.dwellduo.entity.User;
import com.dwellduo.job.MatchCalculationJob;
import com.dwellduo.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Match management
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController {

    private final MatchingService matchingService;
    private final MatchCalculationJob matchCalculationJob;

    /**
     * Get all matches for current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserMatchDto>>> getMyMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<UserMatchDto> matches = matchingService.getMatchesForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    /**
     * Get top matches for current user
     */
    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<UserMatchDto>>> getTopMatches(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit
    ) {
        User user = (User) authentication.getPrincipal();
        List<UserMatchDto> matches = matchingService.getTopMatches(user.getId(), limit);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    /**
     * Get mutual matches (both users liked each other)
     */
    @GetMapping("/mutual")
    public ResponseEntity<ApiResponse<List<UserMatchDto>>> getMutualMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<UserMatchDto> matches = matchingService.getMutualMatches(user.getId());
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    /**
     * Like/Unlike a match
     */
    @PostMapping("/{matchedUserId}/like")
    public ResponseEntity<ApiResponse<UserMatchDto>> toggleLike(
            Authentication authentication,
            @PathVariable Long matchedUserId
    ) {
        User user = (User) authentication.getPrincipal();
        UserMatchDto match = matchingService.toggleLike(user.getId(), matchedUserId);
        return ResponseEntity.ok(ApiResponse.success("Like toggled successfully", match));
    }

    /**
     * Calculate matches for current user (async)
     */
    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<Void>> calculateMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        matchCalculationJob.calculateMatchesForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Match calculation started", null));
    }

    /**
     * Get compatibility score with another user
     */
    @GetMapping("/compatibility/{userId}")
    public ResponseEntity<ApiResponse<Double>> getCompatibilityScore(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        User user = (User) authentication.getPrincipal();
        double score = matchingService.calculateCompatibilityScore(user.getId(), userId);
        return ResponseEntity.ok(ApiResponse.success(score));
    }
}



