package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.model.Transaction;
import com.myFullStackApp.main.service.FinancialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private FinancialService financialService;

    @GetMapping
    public List<Transaction> getAllTransactions(Authentication authentication) {
        return financialService.getTransactionsForUser(authentication.getName());
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        return financialService.addTransaction(authentication.getName(), transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        financialService.deleteTransaction(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}