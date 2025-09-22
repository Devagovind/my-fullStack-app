package com.myFullStackApp.main.repository;

import com.myFullStackApp.main.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    void deleteByUserIdAndType(Long userId, String type);
    void deleteByUserId(Long userId);
    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, Instant startDate, Instant endDate); // <-- ADD THIS
}