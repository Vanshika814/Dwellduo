package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
import com.dwellduo.dto.GameAnswerDto;
import com.dwellduo.dto.GameQuestionDto;
import com.dwellduo.entity.User;
import com.dwellduo.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Game Questions
 */
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

    /**
     * Get all active game questions
     */
    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<GameQuestionDto>>> getAllQuestions() {
        List<GameQuestionDto> questions = gameService.getAllActiveQuestions();
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    /**
     * Submit an answer to a question
     */
    @PostMapping("/answers")
    public ResponseEntity<ApiResponse<Void>> submitAnswer(
            Authentication authentication,
            @Valid @RequestBody GameAnswerDto answerDto
    ) {
        User user = (User) authentication.getPrincipal();
        gameService.submitAnswer(user.getId(), answerDto);
        return ResponseEntity.ok(ApiResponse.success("Answer submitted successfully", null));
    }

    /**
     * Submit multiple answers at once
     */
    @PostMapping("/answers/bulk")
    public ResponseEntity<ApiResponse<Void>> submitAnswers(
            Authentication authentication,
            @Valid @RequestBody List<GameAnswerDto> answers
    ) {
        User user = (User) authentication.getPrincipal();
        gameService.submitAnswers(user.getId(), answers);
        return ResponseEntity.ok(ApiResponse.success("Answers submitted successfully", null));
    }

    /**
     * Check if user has completed all questions
     */
    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<Boolean>> hasCompletedQuestions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean completed = gameService.hasCompletedQuestions(user.getId());
        return ResponseEntity.ok(ApiResponse.success(completed));
    }
}



