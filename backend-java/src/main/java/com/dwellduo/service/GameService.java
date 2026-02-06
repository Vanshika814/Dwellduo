package com.dwellduo.service;

import com.dwellduo.dto.GameAnswerDto;
import com.dwellduo.dto.GameQuestionDto;
import com.dwellduo.entity.GameQuestion;
import com.dwellduo.entity.User;
import com.dwellduo.entity.UserGameAnswer;
import com.dwellduo.exception.BadRequestException;
import com.dwellduo.exception.ResourceNotFoundException;
import com.dwellduo.repository.GameQuestionRepository;
import com.dwellduo.repository.UserGameAnswerRepository;
import com.dwellduo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for game questions and answers
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GameService {

    private final GameQuestionRepository gameQuestionRepository;
    private final UserGameAnswerRepository userGameAnswerRepository;
    private final UserRepository userRepository;

    /**
     * Get all active game questions
     */
    @Cacheable("gameQuestions")
    public List<GameQuestionDto> getAllActiveQuestions() {
        return gameQuestionRepository.findAllActiveQuestionsOrdered().stream()
                .map(this::mapQuestionToDto)
                .collect(Collectors.toList());
    }

    /**
     * Submit user's answer to a question
     */
    public void submitAnswer(Long userId, GameAnswerDto answerDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        GameQuestion question = gameQuestionRepository.findById(answerDto.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", answerDto.getQuestionId()));

        // Check if answer already exists
        UserGameAnswer existingAnswer = userGameAnswerRepository
                .findByUserIdAndQuestionId(userId, answerDto.getQuestionId())
                .orElse(null);

        if (existingAnswer != null) {
            // Update existing answer
            existingAnswer.setAnswer(answerDto.getAnswer());
            existingAnswer.setAnswerText(answerDto.getAnswerText());
            userGameAnswerRepository.save(existingAnswer);
            log.info("Updated answer for user {} on question {}", userId, answerDto.getQuestionId());
        } else {
            // Create new answer
            UserGameAnswer newAnswer = UserGameAnswer.builder()
                    .user(user)
                    .question(question)
                    .answer(answerDto.getAnswer())
                    .answerText(answerDto.getAnswerText())
                    .build();
            userGameAnswerRepository.save(newAnswer);
            log.info("Submitted answer for user {} on question {}", userId, answerDto.getQuestionId());
        }
    }

    /**
     * Submit multiple answers at once
     */
    public void submitAnswers(Long userId, List<GameAnswerDto> answers) {
        for (GameAnswerDto answer : answers) {
            submitAnswer(userId, answer);
        }
        log.info("Submitted {} answers for user {}", answers.size(), userId);
    }

    /**
     * Get user's answers
     */
    public List<UserGameAnswer> getUserAnswers(Long userId) {
        return userGameAnswerRepository.findByUserId(userId);
    }

    /**
     * Check if user has completed all questions
     */
    public boolean hasCompletedQuestions(Long userId) {
        long totalQuestions = gameQuestionRepository.countActiveQuestions();
        long answeredQuestions = userGameAnswerRepository.countAnswersByUser(userId);
        return answeredQuestions >= totalQuestions;
    }

    // Mapper method
    private GameQuestionDto mapQuestionToDto(GameQuestion question) {
        // Build options array from individual option fields
        java.util.List<String> options = new java.util.ArrayList<>();
        if (question.getOptionA() != null && !question.getOptionA().isEmpty()) {
            options.add(question.getOptionA());
        }
        if (question.getOptionB() != null && !question.getOptionB().isEmpty()) {
            options.add(question.getOptionB());
        }
        if (question.getOptionC() != null && !question.getOptionC().isEmpty()) {
            options.add(question.getOptionC());
        }
        if (question.getOptionD() != null && !question.getOptionD().isEmpty()) {
            options.add(question.getOptionD());
        }
        
        return GameQuestionDto.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .type(question.getType())
                .imageUrl(question.getImageUrl())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .isActive(question.getIsActive())
                .weight(question.getWeight())
                .category(question.getCategory())
                .displayOrder(question.getDisplayOrder())
                .options(options)  // Set the options array
                .build();
    }
}



