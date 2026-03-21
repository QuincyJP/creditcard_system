package com.credit.creditcard.repository;

import com.credit.creditcard.model.CreditApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditApplicationRepository extends JpaRepository<CreditApplication, Long> {
}