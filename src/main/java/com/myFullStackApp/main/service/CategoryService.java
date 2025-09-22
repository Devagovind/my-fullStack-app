package com.myFullStackApp.main.service;

import com.myFullStackApp.main.model.Category;
import com.myFullStackApp.main.model.User;
import com.myFullStackApp.main.repository.CategoryRepository;
import com.myFullStackApp.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;

    public List<Category> getCategoriesForUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return categoryRepository.findByUserId(user.getId());
    }

    public Category addCategory(String username, Category category) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        category.setUser(user);
        return categoryRepository.save(category);
    }
}
