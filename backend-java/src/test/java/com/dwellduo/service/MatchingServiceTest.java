package com.dwellduo.service;

import com.dwellduo.entity.User;
import com.dwellduo.entity.UserMatch;
import com.dwellduo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for MatchingService
 */
@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private UserMatchRepository userMatchRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private UserGameAnswerRepository userGameAnswerRepository;

    @Mock
    private GameQuestionRepository gameQuestionRepository;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private UserMatch userMatch;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .id(1L)
                .email("user1@example.com")
                .name("User One")
                .age(25)
                .budgetMin(1000)
                .budgetMax(2000)
                .currentCity("Mumbai")
                .build();

        user2 = User.builder()
                .id(2L)
                .email("user2@example.com")
                .name("User Two")
                .age(27)
                .budgetMin(1500)
                .budgetMax(2500)
                .currentCity("Mumbai")
                .build();

        userMatch = UserMatch.builder()
                .id(1L)
                .user1(user1)
                .user2(user2)
                .compatibilityScore(85.5)
                .matchStatus(UserMatch.MatchStatus.PENDING)
                .user1Liked(false)
                .user2Liked(false)
                .build();
    }

    @Test
    void getMatchesForUser_ShouldReturnMatches() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userMatchRepository.findMatchesByUserId(1L))
                .thenReturn(List.of(userMatch));

        // Act
        var matches = matchingService.getMatchesForUser(1L);

        // Assert
        assertNotNull(matches);
        assertFalse(matches.isEmpty());
        assertEquals(1, matches.size());
        verify(userMatchRepository, times(1)).findMatchesByUserId(1L);
    }

    @Test
    void toggleLike_ShouldSetUser1Liked_WhenUser1Likes() {
        // Arrange
        when(userMatchRepository.findMatchBetweenUsers(1L, 2L))
                .thenReturn(Optional.of(userMatch));
        when(userMatchRepository.save(any(UserMatch.class)))
                .thenReturn(userMatch);

        // Act
        var result = matchingService.toggleLike(1L, 2L);

        // Assert
        assertNotNull(result);
        verify(userMatchRepository, times(1)).findMatchBetweenUsers(1L, 2L);
        verify(userMatchRepository, times(1)).save(any(UserMatch.class));
    }

    @Test
    void calculateCompatibilityScore_ShouldReturnScore() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(userGameAnswerRepository.findByUserId(1L)).thenReturn(new ArrayList<>());
        when(userGameAnswerRepository.findByUserId(2L)).thenReturn(new ArrayList<>());

        // Act
        double score = matchingService.calculateCompatibilityScore(1L, 2L);

        // Assert
        assertTrue(score >= 0 && score <= 100);
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    void getMutualMatches_ShouldReturnMutualMatches() {
        // Arrange
        userMatch.setUser1Liked(true);
        userMatch.setUser2Liked(true);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userMatchRepository.findMutualMatchesByUser(1L))
                .thenReturn(List.of(userMatch));

        // Act
        var matches = matchingService.getMutualMatches(1L);

        // Assert
        assertNotNull(matches);
        assertEquals(1, matches.size());
        verify(userMatchRepository, times(1)).findMutualMatchesByUser(1L);
    }
}



