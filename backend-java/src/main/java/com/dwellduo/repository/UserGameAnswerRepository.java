package com.dwellduo.repository;

import com.dwellduo.entity.UserGameAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for UserGameAnswer entity
 */
@Repository
public interface UserGameAnswerRepository extends JpaRepository<UserGameAnswer, Long> {

    List<UserGameAnswer> findByUserId(Long userId);

    Optional<UserGameAnswer> findByUserIdAndQuestionId(Long userId, Long questionId);

    @Query("SELECT uga FROM UserGameAnswer uga WHERE uga.user.id = :userId")
    List<UserGameAnswer> findAllAnswersByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(uga) FROM UserGameAnswer uga WHERE uga.user.id = :userId")
    long countAnswersByUser(@Param("userId") Long userId);

    void deleteByUserId(Long userId);

    boolean existsByUserIdAndQuestionId(Long userId, Long questionId);
}



