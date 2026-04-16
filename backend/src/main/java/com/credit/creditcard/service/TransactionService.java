package com.credit.creditcard.service;

import com.credit.creditcard.dto.BillResponse;
import com.credit.creditcard.model.CreditCard;
import com.credit.creditcard.model.Transaction;
import com.credit.creditcard.repository.CreditCardRepository;
import com.credit.creditcard.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private CreditCardRepository cardRepo;

    // 🔥 MAIN TRANSACTION METHOD
    public Transaction makeTransaction(String cardNumber, String pin, double amount, String productName) {

        Transaction t = new Transaction();

        try {
            CreditCard card = cardRepo.findByCardNumber(cardNumber)
                    .orElseThrow(() -> new RuntimeException("Card not found"));

            // 🔐 PIN CHECK
            if (!card.getPin().equals(pin)) {
                t.setStatus("FAILED");
                t.setDescription("Invalid PIN");
                return transactionRepo.save(t);
            }

            // 💰 LIMIT CHECK
            if (card.getAvailableLimit() < amount) {
                t.setStatus("FAILED");
                t.setDescription("Insufficient balance");
                return transactionRepo.save(t);
            }

            // ✅ VALID → CREATE PENDING TRANSACTION
            t.setUserId(card.getUserId());
            t.setCardNumber(cardNumber);
            t.setAmount(amount);
            t.setDescription("Purchase - " + productName);
            t.setStatus("PENDING");

            return transactionRepo.save(t);

        } catch (Exception e) {
            t.setStatus("FAILED");
            t.setDescription("Error: " + e.getMessage());
            return transactionRepo.save(t);
        }
    }

    // 📄 GET ALL TRANSACTIONS
    public List<Transaction> getTransactionsByUser(Long userId) {
        return transactionRepo.findByUserId(userId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }
    
    // 🧾 BILL CALCULATION
    public double calculateBill(String cardNumber) {
        return transactionRepo.findByCardNumber(cardNumber)
                .stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    // 💰 BILL + INTEREST
    public BillResponse calculateBillDetails(String cardNumber) {

    double total = transactionRepo.findByCardNumber(cardNumber)
            .stream()
            .filter(t -> "SUCCESS".equals(t.getStatus()))
            .mapToDouble(Transaction::getAmount)
            .sum();

    double interest = total * 0.02;

    return new BillResponse(cardNumber, total, interest);
}

    // ✅ APPROVE
    public Transaction approveTransaction(Long id) {

        Transaction t = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"PENDING".equals(t.getStatus())) {
            throw new RuntimeException("Only pending transactions can be approved");
        }

        CreditCard card = cardRepo.findByCardNumber(t.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // 💳 Deduct NOW (after approval)
        if (card.getAvailableLimit() < t.getAmount()) {
            t.setStatus("FAILED");
            return transactionRepo.save(t);
        }

        card.setAvailableLimit(card.getAvailableLimit() - t.getAmount());
        cardRepo.save(card);

        t.setStatus("SUCCESS");
        t.setApprovedAt(LocalDateTime.now());

        return transactionRepo.save(t);
    }


    // ❌ REJECT
    public Transaction rejectTransaction(Long id) {

        Transaction t = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"PENDING".equals(t.getStatus())) {
            throw new RuntimeException("Only pending transactions can be rejected");
        }

        t.setStatus("FAILED");
        t.setApprovedAt(LocalDateTime.now());

        return transactionRepo.save(t);
    }
    
}