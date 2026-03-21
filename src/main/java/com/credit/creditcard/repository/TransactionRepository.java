package com.credit.creditcard.repository;

import com.credit.creditcard.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCardNumber(String cardNumber);
}