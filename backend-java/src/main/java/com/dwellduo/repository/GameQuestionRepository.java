package com.dwellduo.repository;

import com.dwellduo.entity.GameQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for GameQuestion entity
 */
@Repository
public interface GameQuestionRepository extends JpaRepository<GameQuestion, Long> {

    List<GameQuestion> findByIsActiveTrueOrderByDisplayOrderAsc();

    List<GameQuestion> findByCategory(String category);

    @Query("SELECT gq FROM GameQuestion gq WHERE gq.isActive = true ORDER BY gq.displayOrder ASC")
    List<GameQuestion> findAllActiveQuestionsOrdered();

    @Query("SELECT COUNT(gq) FROM GameQuestion gq WHERE gq.isActive = true")
    long countActiveQuestions();
}



