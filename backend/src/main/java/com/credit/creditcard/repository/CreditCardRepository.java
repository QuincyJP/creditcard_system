package com.credit.creditcard.repository;

import com.credit.creditcard.model.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    Optional<CreditCard> findByCardNumber(String cardNumber);
    List<CreditCard> findByUserId(Long userId);
}