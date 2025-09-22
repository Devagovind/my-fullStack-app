package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.model.Category;
import com.myFullStackApp.main.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getCategories(Authentication authentication) {
        return categoryService.getCategoriesForUser(authentication.getName());
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category, Authentication authentication) {
        return categoryService.addCategory(authentication.getName(), category);
    }
}
