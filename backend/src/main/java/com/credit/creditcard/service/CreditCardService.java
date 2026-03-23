package com.credit.creditcard.service;

import com.credit.creditcard.model.CreditCard;
import com.credit.creditcard.repository.CreditCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CreditCardService {

    @Autowired
    private CreditCardRepository repository;

    // 🔐 Set PIN
    public CreditCard setPin(String cardNumber, String pin) {

        CreditCard card = repository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        card.setPin(pin);

        return repository.save(card);
    }

    public List<CreditCard> getCardsByUserId(Long userId) {
        return repository.findByUserId(userId);
    }
}