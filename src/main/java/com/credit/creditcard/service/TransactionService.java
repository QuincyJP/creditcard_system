package com.credit.creditcard.service;

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
    public Transaction makeTransaction(String cardNumber, String pin, double amount) {

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
        Transaction tx = new Transaction();
        tx.setCardNumber(cardNumber);
        tx.setAmount(amount);
        tx.setDate(LocalDateTime.now());

        return transactionRepo.save(tx);
    }

    // 📄 GET ALL TRANSACTIONS
    public List<Transaction> getTransactions(String cardNumber) {
        return transactionRepo.findByCardNumber(cardNumber);
    }

    // 🧾 BILL CALCULATION
    public double calculateBill(String cardNumber) {
        return transactionRepo.findByCardNumber(cardNumber)
                .stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    // 💰 BILL + INTEREST
    public double calculateBillWithInterest(String cardNumber) {
        double total = calculateBill(cardNumber);
        return total + (total * 0.02); // 2% interest
    }
}