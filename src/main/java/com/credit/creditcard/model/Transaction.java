package com.credit.creditcard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumber;

    private double amount;

    private LocalDateTime date;

    // Getters & Setters

    public Long getId() { return id; }

    public String getCardNumber() { return cardNumber; }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public double getAmount() { return amount; }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getDate() { return date; }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}