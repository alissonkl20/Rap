package com.MoveRap.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Screen {
    @GetMapping("/")
    public String home() {
        return "index";
    }
    
    @GetMapping("/index")
    public String index() {
        return "index";
    }
    
    @GetMapping("/user-page")
    public String userPage() {
        return "user-page";
    }
    
}