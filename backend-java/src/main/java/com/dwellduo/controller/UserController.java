package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
import com.dwellduo.dto.UserDto;
import com.dwellduo.entity.User;
import com.dwellduo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for User management
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Get current user profile
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {

        String email = authentication.getName(); // comes from JWT

        UserDto userDto = userService.getUserByEmail(email);

        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", userDto));
    }


    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    /**
     * Update user profile
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UserDto userDto
    ) {
        String email = authentication.getName(); // comes from JWT

        UserDto updatedUser = userService.updateUserByEmail(email, userDto);

        return ResponseEntity.ok(
                ApiResponse.success("Profile updated successfully", updatedUser)
        );
    }

    /**
     * Delete user account
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.deleteUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }

    /**
     * Mark profile as completed
     */
    @PostMapping("/me/complete-profile")
    public ResponseEntity<ApiResponse<Void>> markProfileCompleted(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.markProfileCompleted(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile marked as completed", null));
    }

    /**
     * Get all active users (Admin only)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllActiveUsers() {
        List<UserDto> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    /**
     * Get users by city
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByCity(@PathVariable String city) {
        List<UserDto> users = userService.getUsersByCity(city);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}



