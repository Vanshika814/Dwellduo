package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
// import com.dwellduo.dto.AuthRequestDto;
import com.dwellduo.dto.AuthResponseDto;
import com.dwellduo.service.AuthService;
import com.dwellduo.dto.RegisterRequest;
import com.dwellduo.dto.LoginRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Authentication
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Register or login with Clerk
     */
    // @PostMapping("/clerk")
    // public ResponseEntity<ApiResponse<AuthResponseDto>> authenticateWithClerk(
    //         @Valid @RequestBody AuthRequestDto request
    // ) {
    //     log.info("Authentication request received for email: {}", request.getEmail());
    //     AuthResponseDto response = authService.authenticateWithClerk(request);
    //     return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    // }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Registered successfully",
                        authService.register(request)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        authService.login(request)
                )
        );
    }

    /**
     * Refresh access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshToken(
            @RequestParam String refreshToken
    ) {
        log.info("Token refresh request received");
        AuthResponseDto response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }
}


