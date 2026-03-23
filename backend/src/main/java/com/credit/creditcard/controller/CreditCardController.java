package com.credit.creditcard.controller;

import com.credit.creditcard.model.CreditCard;
import com.credit.creditcard.repository.CreditCardRepository;
import com.credit.creditcard.service.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000")
public class CreditCardController {

    @Autowired
    private CreditCardService service;

    @Autowired
    private CreditCardRepository repository;
    
    @PostMapping("/set-pin")
    public ResponseEntity<?> setPin(@RequestParam String cardNumber,
                                    @RequestParam String pin) {
        if (!pin.matches("\\d{4}")) {
            return ResponseEntity.badRequest().body("PIN must be 4 digits");
        }

        Optional<CreditCard> cardOpt = repository.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Card not found");
        }

        CreditCard card = cardOpt.get();
        card.setPin(pin); // Optional: hash PIN here for security
        repository.save(card);

        return ResponseEntity.ok("PIN set successfully");
    }

    @GetMapping("/{cardNumber}")
    public CreditCard getCard(@PathVariable String cardNumber) {
        return repository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

    @GetMapping("/user/{userId}")
    public List<CreditCard> getCardsByUser(@PathVariable Long userId) {
        List<CreditCard> cards = service.getCardsByUserId(userId);

        System.out.println("🔥 CARDS SIZE: " + cards.size());

        for (CreditCard c : cards) {
            System.out.println("👉 " + c.getCardNumber());
        }

        return cards;
        }
}