package com.credit.creditcard.service;

import com.credit.creditcard.model.CreditApplication;
import com.credit.creditcard.model.CreditCard;
import com.credit.creditcard.repository.CreditApplicationRepository;
import com.credit.creditcard.repository.CreditCardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditApplicationService {

    @Autowired
    private CreditApplicationRepository repository;

    @Autowired
    private CreditCardRepository cardRepository;
    // 🔥 CIBIL-like score calculation
    public int calculateScore(double income, double loans, double emi, String employment) {

        int score = 600;

        if (income > 50000) score += 50;
        if (income > 100000) score += 50;

        if (loans < 50000) score += 50;
        if (emi < 20000) score += 50;

        if (employment.equalsIgnoreCase("SALARIED")) score += 50;
        else score += 20;

        return Math.min(score, 900);
    }

    // 🔥 Apply for credit card
    public CreditApplication apply(CreditApplication app) {

         System.out.println("🔥 APPLY API HIT - SERVICE");

        int score = calculateScore(
                app.getIncome(),
                app.getExistingLoans(),
                app.getMonthlyEMI(),
                app.getEmploymentType()
        );

        app.setCalculatedScore(score);
        app.setStatus("PENDING");

        return repository.save(app);
    }


    // 🔥 Get all applications (Admin view)
    public List<CreditApplication> getAllApplications() {
        return repository.findAll();
    }

    // 🔥 Process (Approve / Reject)
    public CreditApplication processApplication(Long id) {

        CreditApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        int score = app.getCalculatedScore();

        if (score >= 750) {
            app.setStatus("APPROVED");

            CreditCard card = new CreditCard();
            card.setUserId(app.getUserId());
            card.setCardNumber(generateCardNumber());
            card.setCreditLimit(calculateLimit(score));
            card.setAvailableLimit(card.getCreditLimit());

            cardRepository.save(card);
        } else {
            app.setStatus("REJECTED");
        }

        return repository.save(app);
    }

    // 🔥 Generate random 16-digit card number
    public String generateCardNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            sb.append((int)(Math.random() * 10));
        }
        return sb.toString();
    }

    // 🔥 Decide credit limit based on score
    public double calculateLimit(int score) {
        if (score >= 800) return 200000;
        else if (score >= 750) return 100000;
        else return 50000;
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }
}