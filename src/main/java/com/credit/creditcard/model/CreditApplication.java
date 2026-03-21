package com.credit.creditcard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "credit_applications")
public class CreditApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private double income;

    private String employmentType;

    private double existingLoans;

    private double monthlyEMI;

    private int calculatedScore;

    private String status; // PENDING / APPROVED / REJECTED

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public double getExistingLoans() {
        return existingLoans;
    }

    public void setExistingLoans(double existingLoans) {
        this.existingLoans = existingLoans;
    }

    public double getMonthlyEMI() {
        return monthlyEMI;
    }

    public void setMonthlyEMI(double monthlyEMI) {
        this.monthlyEMI = monthlyEMI;
    }

    public int getCalculatedScore() {
        return calculatedScore;
    }

    public void setCalculatedScore(int calculatedScore) {
        this.calculatedScore = calculatedScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}