package com.credit.creditcard.controller;

import com.credit.creditcard.model.CreditCard;
import com.credit.creditcard.repository.CreditCardRepository;
import com.credit.creditcard.service.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
public class CreditCardController {

    @Autowired
    private CreditCardService service;

    @Autowired
    private CreditCardRepository repository;
    
    @PostMapping("/set-pin")
    public CreditCard setPin(@RequestParam String cardNumber,
                            @RequestParam String pin) {
        return service.setPin(cardNumber, pin);
    }

    @GetMapping("/{cardNumber}")
    public CreditCard getCard(@PathVariable String cardNumber) {
        return repository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }
}