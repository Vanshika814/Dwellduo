package com.dwellduo.dto;

import com.dwellduo.entity.GameQuestion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for GameQuestion entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameQuestionDto {

    private Long id;

    @NotBlank(message = "Question text is required")
    private String question;

    @NotNull(message = "Question type is required")
    private GameQuestion.QuestionType type;

    private String imageUrl;
    
    @JsonIgnore // Don't send individual options to frontend
    private String optionA;
    
    @JsonIgnore
    private String optionB;
    
    @JsonIgnore
    private String optionC;
    
    @JsonIgnore
    private String optionD;
    
    private Boolean isActive;
    private Integer weight;
    private String category;
    private Integer displayOrder;
    
    // Real field for frontend - populated in service layer
    private List<String> options;
}



