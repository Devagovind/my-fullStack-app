package com.myFullStackApp.main.repository;

import com.myFullStackApp.main.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserIdAndCategoryIdAndMonthAndYear(Long userId, Long categoryId, int month, int year);
    List<Budget> findByUserIdAndMonthAndYear(Long userId, int month, int year);
}