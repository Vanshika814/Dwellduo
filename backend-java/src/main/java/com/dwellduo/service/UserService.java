package com.dwellduo.service;

import com.dwellduo.dto.UserDto;
import com.dwellduo.dto.UserMatchDto;
import com.dwellduo.entity.User;
import com.dwellduo.exception.ResourceNotFoundException;
import com.dwellduo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for User management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /**
     * Get user by ID. Returns minimal DTO on any error so callers (e.g. Chat) never get 500.
     * Cache disabled to avoid 500s from cache serialization/deserialization of complex DTOs.
     */
    public UserDto getUserById(Long id) {
        User user = null;
        try {
            user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
            return mapToDto(user);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.warn("getUserById({}) failed, returning minimal DTO: {}", id, e.getMessage());
            if (user != null) {
                return UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail() != null ? user.getEmail() : "user" + id + "@dwellduo.local")
                        .name(user.getName() != null ? user.getName() : "User " + id)
                        .build();
            }
            return UserDto.builder()
                    .id(id)
                    .email("user" + id + "@dwellduo.local")
                    .name("User " + id)
                    .build();
        }
    }

    /**
     * Get user by email
     */
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToDto(user);
    }

    public UserDto updateUserByEmail(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    
        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getBio() != null) user.setBio(userDto.getBio());
        if (userDto.getPhoneNumber() != null) user.setPhoneNumber(userDto.getPhoneNumber());
        if (userDto.getPhone() != null) user.setPhoneNumber(userDto.getPhone()); // Alias
        if (userDto.getAge() != null) user.setAge(userDto.getAge());
        if (userDto.getGender() != null) user.setGender(userDto.getGender());
        if (userDto.getCurrentCity() != null) user.setCurrentCity(userDto.getCurrentCity());
        if (userDto.getCity() != null) user.setCurrentCity(userDto.getCity()); // Alias
        if (userDto.getProfileImage() != null) user.setProfileImage(userDto.getProfileImage());
        if (userDto.getBudget() != null) user.setBudget(userDto.getBudget());
        if (userDto.getLocationPreference() != null) user.setLocationPreference(userDto.getLocationPreference());
        if (userDto.getGenderPreference() != null) user.setGenderPreference(userDto.getGenderPreference());
        if (userDto.getLatitude() != null && userDto.getLongitude() != null) {
            String point = String.format(
                "POINT(%f %f)",
                userDto.getLongitude(),
                userDto.getLatitude()
            );
            user.setLocation(point);
        }
        return mapToDto(userRepository.save(user));
    }

    /**
     * Get user by Clerk ID
     */
    // public UserDto getUserByClerkId(String clerkId) {
    //     User user = userRepository.findByClerkId(clerkId)
    //             .orElseThrow(() -> new ResourceNotFoundException("User", "clerkId", clerkId));
    //     return mapToDto(user);
    // }
    

    /**
     * Get all active users
     */
    public List<UserDto> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Update user profile
     */
    @CacheEvict(value = "users", key = "#id")
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Update fields
        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getBio() != null) user.setBio(userDto.getBio());
        if (userDto.getPhoneNumber() != null) user.setPhoneNumber(userDto.getPhoneNumber());
        if (userDto.getPhone() != null) user.setPhoneNumber(userDto.getPhone()); // Alias
        if (userDto.getAge() != null) user.setAge(userDto.getAge());
        if (userDto.getGender() != null) user.setGender(userDto.getGender());
        if (userDto.getCurrentCity() != null) user.setCurrentCity(userDto.getCurrentCity());
        if (userDto.getCity() != null) user.setCurrentCity(userDto.getCity()); // Alias
        if (userDto.getMoveInDate() != null) user.setMoveInDate(userDto.getMoveInDate());
        if (userDto.getBudgetMin() != null) user.setBudgetMin(userDto.getBudgetMin());
        if (userDto.getBudgetMax() != null) user.setBudgetMax(userDto.getBudgetMax());
        if (userDto.getProfileImage() != null) user.setProfileImage(userDto.getProfileImage());
        if (userDto.getBudget() != null) user.setBudget(userDto.getBudget());
        if (userDto.getLocationPreference() != null) user.setLocationPreference(userDto.getLocationPreference());
        if (userDto.getGenderPreference() != null) user.setGenderPreference(userDto.getGenderPreference());
        if (userDto.getLatitude() != null && userDto.getLongitude() != null) {
            String point = String.format(
                "POINT(%f %f)",
                userDto.getLongitude(),
                userDto.getLatitude()
            );
            user.setLocation(point);
        }

        User savedUser = userRepository.save(user);
        log.info("Updated user profile: {}", savedUser.getId());
        return mapToDto(savedUser);
    }

    /**
     * Delete user (soft delete)
     */
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setIsActive(false);
        userRepository.save(user);
        log.info("Soft deleted user: {}", id);
    }

    /**
     * Check if profile is completed
     */
    public boolean isProfileCompleted(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return user.getProfileCompleted();
    }

    /**
     * Mark profile as completed
     */
    @CacheEvict(value = "users", key = "#userId")
    public void markProfileCompleted(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setProfileCompleted(true);
        userRepository.save(user);
        log.info("Profile marked as completed for user: {}", userId);
    }

    /**
     * Get users by city
     */
    public List<UserDto> getUsersByCity(String city) {
        return userRepository.findActiveUsersInCity(city).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find nearby users within radius (in meters)
     */
    public List<UserMatchDto> findNearbyUsers(double lat, double lng, double radiusMeters) {
        List<Object[]> results = userRepository.findNearbyUsers(lat, lng, radiusMeters);

        return results.stream().map(row -> {
            Long userId = ((Number) row[0]).longValue();
            Double distanceMeters = ((Number) row[1]).doubleValue();
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            return UserMatchDto.builder()
                    .id(user.getId())
                    .matchedUser(mapToDto(user))
                    .distance(distanceMeters / 1000) // convert to km
                    .build();
        }).toList();
    }

    // Mapper methods
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .phoneNumber(user.getPhoneNumber())
                .phone(user.getPhoneNumber()) // Alias for frontend
                .age(user.getAge())
                .gender(user.getGender())
                .currentCity(user.getCurrentCity())
                .city(user.getCurrentCity()) // Alias for frontend
                .moveInDate(user.getMoveInDate())
                .budgetMin(user.getBudgetMin())
                .budgetMax(user.getBudgetMax())
                .budget(user.getBudget())
                .locationPreference(user.getLocationPreference())
                .genderPreference(user.getGenderPreference())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .profileCompleted(user.getProfileCompleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .build();
    }
}



