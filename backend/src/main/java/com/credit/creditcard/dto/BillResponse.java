package com.credit.creditcard.dto;

public class BillResponse {

    private String cardNumber;
    private double totalAmount;
    private double interest;
    private double finalAmount;

    public BillResponse(String cardNumber, double totalAmount, double interest) {
        this.cardNumber = cardNumber;
        this.totalAmount = totalAmount;
        this.interest = interest;
        this.finalAmount = totalAmount + interest;
    }

    public String getCardNumber() { return cardNumber; }
    public double getTotalAmount() { return totalAmount; }
    public double getInterest() { return interest; }
    public double getFinalAmount() { return finalAmount; }
}