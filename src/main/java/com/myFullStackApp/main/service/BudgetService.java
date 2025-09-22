package com.myFullStackApp.main.service;

import com.myFullStackApp.main.dto.BudgetDTO;
import com.myFullStackApp.main.model.*;
import com.myFullStackApp.main.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private BudgetRepository budgetRepository;
    @Autowired private TransactionRepository transactionRepository;

    public List<BudgetDTO> getBudgetsForCurrentUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        // 1. Get all transactions for the current month
        YearMonth yearMonth = YearMonth.of(year, month);
        List<Transaction> monthlyTransactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                user.getId(),
                yearMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC),
                yearMonth.atEndOfMonth().atTime(23, 59, 59).toInstant(ZoneOffset.UTC)
        );

        // 2. Calculate total spent per category
        Map<Long, BigDecimal> spentPerCategory = monthlyTransactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()) && t.getCategory() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getId(),
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        // 3. Get all user categories and their set budgets
        List<Category> userCategories = categoryRepository.findByUserId(user.getId());

        // 4. Combine everything into a DTO
        return userCategories.stream().map(category -> {
            BigDecimal budgetAmount = budgetRepository
                    .findByUserIdAndCategoryIdAndMonthAndYear(user.getId(), category.getId(), month, year)
                    .map(Budget::getAmount).orElse(BigDecimal.ZERO);
            BigDecimal spentAmount = spentPerCategory.getOrDefault(category.getId(), BigDecimal.ZERO);
            return new BudgetDTO(category.getId(), category.getName(), budgetAmount, spentAmount);
        }).collect(Collectors.toList());
    }

    public Budget setBudget(String username, Long categoryId, BigDecimal amount) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        Budget budget = budgetRepository
                .findByUserIdAndCategoryIdAndMonthAndYear(user.getId(), categoryId, month, year)
                .orElse(new Budget());

        budget.setUser(user);
        budget.setCategory(category);
        budget.setAmount(amount);
        budget.setMonth(month);
        budget.setYear(year);

        return budgetRepository.save(budget);
    }
}
