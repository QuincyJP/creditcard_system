package com.credit.creditcard.controller;

import com.credit.creditcard.model.CreditApplication;
import com.credit.creditcard.service.CreditApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class CreditApplicationController {

    @Autowired
    private CreditApplicationService service;

    @PostMapping("/apply")
    public CreditApplication apply(@RequestBody CreditApplication app) {
        return service.apply(app);
    }

    // 🔥 Get all applications (Admin)
    @GetMapping("/all")
    public List<CreditApplication> getAll() {
        return service.getAllApplications();
    }

    // 🔥 Approve / Reject API
    @PostMapping("/process/{id}")
    public CreditApplication process(@PathVariable Long id) {
        return service.processApplication(id);
    }
}