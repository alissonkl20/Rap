package com.MoveRap.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Screen {
    @GetMapping("/")
    public String home() {
        return "redirect:/index.html";
    }
}