package com.dwellduo.service;

import com.dwellduo.dto.AuthResponseDto;
import com.dwellduo.dto.UserDto;
import com.dwellduo.entity.User;
import com.dwellduo.dto.RegisterRequest;
import com.dwellduo.dto.LoginRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.dwellduo.exception.BadRequestException;
import com.dwellduo.repository.UserRepository;
import com.dwellduo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Authentication (Clerk integration + JWT)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Refresh access token
     */
    public AuthResponseDto refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String email = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user);
        UserDto userDto = mapToDto(user);

        return AuthResponseDto.of(newAccessToken, refreshToken, userDto);
    }

    // register
    public AuthResponseDto register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
    
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
    
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isActive(true)
                .profileCompleted(false)
                .build();
    
        userRepository.save(user);
    
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
    
        return AuthResponseDto.of(accessToken, refreshToken, mapToDto(user));
    }

    // login
    public AuthResponseDto login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
    
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
    
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
    
        return AuthResponseDto.of(accessToken, refreshToken, mapToDto(user));
    }
    

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .phoneNumber(user.getPhoneNumber())
                .age(user.getAge())
                .gender(user.getGender())
                .currentCity(user.getCurrentCity())
                .moveInDate(user.getMoveInDate())
                .budgetMin(user.getBudgetMin())
                .budgetMax(user.getBudgetMax())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .profileCompleted(user.getProfileCompleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}


