// FILE: src/main/java/com/myFullStackApp/main/service/FinancialService.java
package com.myFullStackApp.main.service;

import com.myFullStackApp.main.dto.TransactionDTO;
import com.myFullStackApp.main.model.Transaction;
import com.myFullStackApp.main.model.User;
import com.myFullStackApp.main.repository.TransactionRepository;
import com.myFullStackApp.main.repository.UserRepository;
import com.myFullStackApp.main.repository.FinancialProfileRepository; // Import if needed for reset
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FinancialService {

    @Autowired private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private FinancialProfileRepository financialProfileRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET ALL TRANSACTIONS FOR A USER
    public List<TransactionDTO> getTransactionsForUser(String username) {
        User user = getUserByUsername(username);
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

        // Convert the list of entities to a list of DTOs
        return transactions.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // GET FINANCIAL SUMMARY (INCOME vs EXPENSE)
    public Map<String, BigDecimal> getFinancialSummary(String username) {
        User user = getUserByUsername(username);
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of("income", totalIncome, "expenses", totalExpenses);
    }

    // ADD A SINGLE NEW TRANSACTION (INCOME OR EXPENSE)
    public Transaction addTransaction(String username, Transaction transaction) {
        User user = getUserByUsername(username);
        transaction.setUser(user);
        transaction.setTransactionDate(Instant.now());
        return transactionRepository.save(transaction);
    }

    // DELETE A SINGLE TRANSACTION
    @Transactional
    public void deleteTransaction(String username, Long transactionId) {
        User user = getUserByUsername(username);
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Security check: Ensure the transaction belongs to the logged-in user
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to delete this transaction");
        }
        transactionRepository.delete(transaction);
    }

    // RESET ALL FINANCIAL DATA FOR A USER
    @Transactional
    public void resetAllFinances(String username) {
        User user = getUserByUsername(username);
        transactionRepository.deleteByUserId(user.getId());
        financialProfileRepository.deleteByUserId(user.getId());
    }

    private TransactionDTO convertToDto(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setName(transaction.getName());
        dto.setAmount(transaction.getAmount());
        dto.setType(transaction.getType());
        dto.setTransactionDate(transaction.getTransactionDate());
        if (transaction.getCategory() != null) {
            dto.setCategoryId(transaction.getCategory().getId());
            dto.setCategoryName(transaction.getCategory().getName());
        }
        return dto;
    }
}