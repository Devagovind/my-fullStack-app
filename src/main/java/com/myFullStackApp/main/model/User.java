package com.myFullStackApp.main.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users") // This tells Hibernate to map this class to the 'users' table
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Assumes you are using SERIAL or IDENTITY for auto-increment
    private Long id;

    private String username;

    private String email;

    @Column(name = "created_at") // Maps this field to the 'created_at' column
    private Instant createdAt;

    // --- Getters and Setters ---
    // (Required by JPA)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
