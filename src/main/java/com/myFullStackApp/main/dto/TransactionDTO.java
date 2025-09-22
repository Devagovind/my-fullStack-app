package com.myFullStackApp.main.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private String type;
    private Instant transactionDate;
    private Long categoryId;
    private String categoryName;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public Instant getTransactionDate() {
        return transactionDate;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setTransactionDate(Instant transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    // Constructors, Getters, and Setters for all fields
    // You can generate these in IntelliJ
}
