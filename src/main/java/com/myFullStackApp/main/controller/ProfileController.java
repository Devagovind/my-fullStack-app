package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.model.User;
import com.myFullStackApp.main.security.JwtUtil;
import com.myFullStackApp.main.security.MyUserDetailsService; // <-- ADD THIS IMPORT
import com.myFullStackApp.main.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired // <-- ADD THIS
    private MyUserDetailsService myUserDetailsService; // <-- ADD THIS SERVICE

    @GetMapping("/me")
    public User getCurrentUserProfile() {
        return userService.getCurrentUserProfile();
    }

    @PutMapping("/me")
    public Map<String, Object> updateCurrentUserProfile(@RequestBody User userDetails) {
        // 1. Update the user in the database
        User updatedUser = userService.updateCurrentUserProfile(userDetails);

        // 2. Reliably load the UserDetails for the *new* username
        // This ensures we have the correct, non-null password hash for token generation.
        final UserDetails updatedUserDetails = myUserDetailsService.loadUserByUsername(updatedUser.getUsername());

        // 3. Generate a brand new token with the updated username
        final String newToken = jwtUtil.generateToken(updatedUserDetails);

        // 4. Return both the user details and the new token
        Map<String, Object> response = new HashMap<>();
        response.put("user", updatedUser);
        response.put("token", newToken);

        return response;
    }

    @PostMapping("/password")
    public void changePassword(@RequestBody Map<String, String> passwordData) {
        userService.changeCurrentUserPassword(passwordData.get("oldPassword"), passwordData.get("newPassword"));
    }
}