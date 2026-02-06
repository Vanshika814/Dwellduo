package com.dwellduo.controller;

import com.dwellduo.dto.ApiResponse;
import com.dwellduo.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Image Upload (Cloudinary)
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload image to Cloudinary
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadImage(
            @RequestParam("image") MultipartFile file
    ) {
        try {
            log.info("Image upload request received: {}", file.getOriginalFilename());

            // Validate file
            if (file.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<Map<String, Object>>builder()
                                .success(false)
                                .message("Please select a file to upload")
                                .data(errorResponse)
                                .build());
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, Object> errorResponse = new HashMap<>();
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<Map<String, Object>>builder()
                                .success(false)
                                .message("File must be an image")
                                .data(errorResponse)
                                .build());
            }

            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);

            // Extract relevant data
            Map<String, Object> response = new HashMap<>();
            response.put("imageUrl", uploadResult.get("secure_url"));
            response.put("publicId", uploadResult.get("public_id"));
            response.put("width", uploadResult.get("width"));
            response.put("height", uploadResult.get("height"));
            response.put("format", uploadResult.get("format"));

            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", response));

        } catch (Exception e) {
            log.error("Image upload failed", e);
            Map<String, Object> errorResponse = new HashMap<>();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Image upload failed: " + e.getMessage())
                            .data(errorResponse)
                            .build());
        }
    }

    /**
     * Delete image from Cloudinary
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteImage(@RequestParam String publicId) {
        try {
            log.info("Image delete request received: {}", publicId);
            cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", null));
        } catch (Exception e) {
            log.error("Image deletion failed", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Image deletion failed: " + e.getMessage()));
        }
    }
}

