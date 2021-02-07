package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.service.UserService;

@Controller
public class ViewController {

    @Autowired
    private UserService userService;

    @GetMapping("/admin")
    public String admin(Model model, Authentication auth) {
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        return "restAdmin";
    }

    @GetMapping("/user")
    public String user(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        return "restUser";
    }
}
