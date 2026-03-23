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

        CreditCard card = cardRepo.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // 🔐 PIN CHECK
        if (!card.getPin().equals(pin)) {
            throw new RuntimeException("Invalid PIN");
        }

        // 💰 LIMIT CHECK
        if (card.getAvailableLimit() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // 💳 DEDUCT LIMIT
        card.setAvailableLimit(card.getAvailableLimit() - amount);
        cardRepo.save(card);

        // 🧾 SAVE TRANSACTION
        Transaction t = new Transaction();

        t.setUserId(card.getUserId()); // 🔥 link to user
        t.setCardNumber(cardNumber);
        t.setAmount(amount);
        t.setDescription("Purchase - " + productName); // or just "Purchase"
        t.setStatus("SUCCESS");

        return transactionRepo.save(t);
    }

    // 📄 GET ALL TRANSACTIONS
    public List<Transaction> getTransactionsByUser(Long userId) {
        return transactionRepo.findByUserId(userId);
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
}