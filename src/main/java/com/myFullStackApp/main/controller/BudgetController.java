package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.dto.BudgetDTO;
import com.myFullStackApp.main.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public List<BudgetDTO> getBudgets(Authentication authentication) {
        return budgetService.getBudgetsForCurrentUser(authentication.getName());
    }

    @PostMapping
    public void setBudget(@RequestBody Map<String, Object> payload, Authentication authentication) {
        Long categoryId = Long.valueOf(payload.get("categoryId").toString());
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        budgetService.setBudget(authentication.getName(), categoryId, amount);
    }
}
