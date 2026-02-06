package com.dwellduo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Simple Cloudinary image upload service
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-folder}")
    private String uploadFolder;

    /**
     * Upload image to Cloudinary (simple version)
     */
    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {
        log.info("Uploading: {}", file.getOriginalFilename());
        
        // Simple upload with just folder
        Map<String, Object> result = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap("folder", uploadFolder)
        );
        
        log.info("Uploaded: {}", result.get("secure_url"));
        return result;
    }

    /**
     * Delete image from Cloudinary
     */
    public Map<String, Object> deleteImage(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}

