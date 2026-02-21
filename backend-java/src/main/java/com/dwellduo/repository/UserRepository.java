package com.dwellduo.repository;

import com.dwellduo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // Optional<User> findByClerkId(String clerkId);

    boolean existsByEmail(String email);

    // boolean existsByClerkId(String clerkId);

    List<User> findByIsActiveTrue();

    List<User> findByProfileCompletedTrue();

    @Query("SELECT u FROM User u WHERE LOWER(u.currentCity) = LOWER(:city) AND u.isActive = true AND u.profileCompleted = true")
    List<User> findActiveUsersInCity(@Param("city") String city);

    @Query("SELECT u FROM User u WHERE u.budgetMin <= :maxBudget AND u.budgetMax >= :minBudget AND u.isActive = true")
    List<User> findUsersByBudgetRange(@Param("minBudget") Integer minBudget, @Param("maxBudget") Integer maxBudget);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    @Query(value = """
    SELECT u.id,
           ST_Distance(
             CAST(u.location AS geography),
             CAST(ST_SetSRID(ST_MakePoint(:lng, :lat), 4326) AS geography)
           ) AS distance
    FROM users u
    WHERE u.location IS NOT NULL
    AND ST_DWithin(
      CAST(u.location AS geography),
      CAST(ST_SetSRID(ST_MakePoint(:lng, :lat), 4326) AS geography),
      :radius
    )
    ORDER BY distance ASC
    """, nativeQuery = true)
    List<Object[]> findNearbyUsers(
        @Param("lat") double lat,
        @Param("lng") double lng,
        @Param("radius") double radius
    );
}



