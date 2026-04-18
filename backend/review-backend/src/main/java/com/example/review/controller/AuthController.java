package com.example.review.controller;

import com.example.review.model.User;
import com.example.review.repository.UserRepository;
import com.example.review.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {
        Optional<User> userOpt = userRepository.findByUsername(loginReq.getUsername());
        if (userOpt.isEmpty() || !passwordEncoder.matches(loginReq.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User u = userOpt.get();
        String token = jwtUtil.generateToken(u.getUsername(), u.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", u.getRole());
        response.put("username", u.getUsername());
        return ResponseEntity.ok(response);
    }
}