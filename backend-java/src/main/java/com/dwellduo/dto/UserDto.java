package com.dwellduo.dto;

import com.dwellduo.entity.User;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for User entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String profileImage;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number must be valid")
    private String phoneNumber;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must not exceed 100")
    private Integer age;

    private User.Gender gender;
    private String currentCity;
    private LocalDateTime moveInDate;

    @Min(value = 0, message = "Budget minimum must be positive")
    private Integer budgetMin;

    @Min(value = 0, message = "Budget maximum must be positive")
    private Integer budgetMax;

    // Roommate preferences (for frontend compatibility)
    private String budget;
    private String locationPreference;
    private String genderPreference;
    private String city; // Alias for currentCity
    private String phone; // Alias for phoneNumber

    private User.Role role;
    private Boolean isActive;
    private Boolean profileCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



