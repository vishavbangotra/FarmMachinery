package com.farmify.backend.controller;

import com.farmify.backend.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("/test")
    @PreAuthorize("permitAll()")
    public ApiResponse<String> test(){
        logger.info("Test endpoint called");
        return new ApiResponse<>(true, "Test successful", "Hello World!");
    }
}

