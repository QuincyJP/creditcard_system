package com.credit.creditcard.controller;

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
                           @RequestParam double amount) {
        return service.makeTransaction(cardNumber, pin, amount);
    }

    // 📄 GET TRANSACTIONS
    @GetMapping("/{cardNumber}")
    public List<Transaction> getTransactions(@PathVariable String cardNumber) {
        return service.getTransactions(cardNumber);
    }

    // 🧾 BILL
    @GetMapping("/bill/{cardNumber}")
    public double getBill(@PathVariable String cardNumber) {
        return service.calculateBillWithInterest(cardNumber);
    }
}