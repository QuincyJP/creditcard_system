package com.credit.creditcard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // 🔥 IMPORTANT (for history per user)

    private String cardNumber;

    private double amount;

    private String description; // 🔥 "Laptop", "Shoes", etc.

    private String status; // 🔥 SUCCESS / FAILED

    private LocalDateTime date;

    // 🔥 Automatically set date before saving
    @PrePersist
    protected void onCreate() {
        this.date = LocalDateTime.now();
    }

    // Getters & Setters

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDate() { return date; }
}