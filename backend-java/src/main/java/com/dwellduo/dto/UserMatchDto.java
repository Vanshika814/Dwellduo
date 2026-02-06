package com.dwellduo.dto;

import com.dwellduo.entity.UserMatch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for UserMatch entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMatchDto {

    private Long id;
    private UserDto matchedUser;
    private Double compatibilityScore;
    private Double preferenceScore;
    private Double gameScore;
    private Double lifestyleScore;
    private UserMatch.MatchStatus matchStatus;
    private Boolean liked;
    private Boolean viewed;
    private Boolean mutualMatch;
    private LocalDateTime matchedAt;
    private LocalDateTime createdAt;
}



