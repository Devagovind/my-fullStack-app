package com.myFullStackApp.main.service;

import com.myFullStackApp.main.model.User;
import com.myFullStackApp.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired // <-- THIS IS THE LINE YOU NEED TO ADD
    private PasswordEncoder passwordEncoder;

    // GET the currently logged-in user's details
    public User getCurrentUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // UPDATE the currently logged-in user's details
    public User updateCurrentUserProfile(User userDetails) {
        User currentUser = getCurrentUserProfile();
        currentUser.setUsername(userDetails.getUsername());
        currentUser.setEmail(userDetails.getEmail());
        return userRepository.save(currentUser);
    }

    // CHANGE the currently logged-in user's password
    public void changeCurrentUserPassword(String oldPassword, String newPassword) {
        User currentUser = getCurrentUserProfile();

        // 1. Verify the old password is correct
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        // 2. Hash and save the new password
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    // READ all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // READ a single user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // CREATE a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // UPDATE a user
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());

        return userRepository.save(user);
    }

    // DELETE a user
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }
}