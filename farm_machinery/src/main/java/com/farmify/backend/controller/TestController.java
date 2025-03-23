package com.farmify.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {
    
    @GetMapping("/test")
    @PreAuthorize("permitAll()")
    public String test(){
        return "Hello World!";
    }
    
    }

