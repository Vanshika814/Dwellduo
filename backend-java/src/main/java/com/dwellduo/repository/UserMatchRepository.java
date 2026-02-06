package com.dwellduo.repository;

import com.dwellduo.entity.UserMatch;
import com.dwellduo.entity.UserMatch.MatchStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for UserMatch entity
 */
@Repository
public interface UserMatchRepository extends JpaRepository<UserMatch, Long> {

    @Query("SELECT um FROM UserMatch um WHERE (um.user1.id = :userId OR um.user2.id = :userId) ORDER BY um.compatibilityScore DESC")
    List<UserMatch> findMatchesByUserId(@Param("userId") Long userId);

    @Query("SELECT um FROM UserMatch um WHERE (um.user1.id = :userId OR um.user2.id = :userId) AND um.matchStatus = :status ORDER BY um.compatibilityScore DESC")
    List<UserMatch> findMatchesByUserIdAndStatus(@Param("userId") Long userId, @Param("status") MatchStatus status);

    @Query("SELECT um FROM UserMatch um WHERE ((um.user1.id = :userId AND um.user1Liked = true) OR (um.user2.id = :userId AND um.user2Liked = true)) ORDER BY um.compatibilityScore DESC")
    List<UserMatch> findLikedMatchesByUser(@Param("userId") Long userId);

    @Query("SELECT um FROM UserMatch um WHERE (um.user1.id = :userId OR um.user2.id = :userId) AND um.user1Liked = true AND um.user2Liked = true ORDER BY um.matchedAt DESC")
    List<UserMatch> findMutualMatchesByUser(@Param("userId") Long userId);

    Optional<UserMatch> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    @Query("SELECT um FROM UserMatch um WHERE (um.user1.id = :user1Id AND um.user2.id = :user2Id) OR (um.user1.id = :user2Id AND um.user2.id = :user1Id)")
    Optional<UserMatch> findMatchBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT um FROM UserMatch um WHERE (um.user1.id = :userId OR um.user2.id = :userId) ORDER BY um.compatibilityScore DESC")
    Page<UserMatch> findMatchesByUserIdPaginated(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT um FROM UserMatch um WHERE um.user1.id = :userId ORDER BY um.compatibilityScore DESC")
    List<UserMatch> findTopMatchesForUser(@Param("userId") Long userId, Pageable pageable);

    boolean existsByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    @Query("SELECT COUNT(um) FROM UserMatch um WHERE (um.user1.id = :userId OR um.user2.id = :userId) AND um.user1Liked = true AND um.user2Liked = true")
    long countMutualMatchesForUser(@Param("userId") Long userId);
}



