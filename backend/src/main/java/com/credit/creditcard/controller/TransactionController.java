package com.credit.creditcard.controller;

import com.credit.creditcard.dto.BillResponse;
import com.credit.creditcard.model.Transaction;
import com.credit.creditcard.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService service;

    // 💳 MAKE PAYMENT
    @PostMapping("/pay")
    public Transaction pay(@RequestParam String cardNumber,
                           @RequestParam String pin,
                           @RequestParam double amount,
                           @RequestParam String productName) {
        return service.makeTransaction(cardNumber, pin, amount, productName);
    }

    // 📄 GET TRANSACTIONS
    @GetMapping("/user/{userId}")
    public List<Transaction> getByUser(@PathVariable Long userId) {
        return service.getTransactionsByUser(userId);
    }

    // 🧾 BILL
    @GetMapping("/bill/{cardNumber}")
    public BillResponse getBill(@PathVariable String cardNumber) {
        return service.calculateBillDetails(cardNumber);
    }

    // ✅ APPROVE
    @PostMapping("/approve/{id}")
    public Transaction approve(@PathVariable Long id) {
        return service.approveTransaction(id);
    }

    // ❌ REJECT
    @PostMapping("/reject/{id}")
    public Transaction reject(@PathVariable Long id) {
        return service.rejectTransaction(id);
    }

    @GetMapping("/all")
    public List<Transaction> getAllTransactions() {
        return service.getAllTransactions();
    }
}