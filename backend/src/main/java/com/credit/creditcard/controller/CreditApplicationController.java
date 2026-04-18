package com.credit.creditcard.controller;

import com.credit.creditcard.model.CreditApplication;
import com.credit.creditcard.service.CreditApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class CreditApplicationController {

    @Autowired
    private CreditApplicationService service;

    @PostMapping("/apply")
    public CreditApplication apply(@RequestBody CreditApplication app) {

        System.out.println("🔥 APPLY API HIT - CONTROLLER");

        return service.apply(app);
    }

    // 🔥 Get all applications (Admin)
    @GetMapping("/all")
    public List<CreditApplication> getAll() {

        System.out.println("📋 FETCH ALL APPLICATIONS");

        return service.getAllApplications();
    }

    // 🔥 Approve / Reject API
    @PostMapping("/process/{id}")
    public CreditApplication process(@PathVariable Long id) {

        System.out.println("⚙️ PROCESS APPLICATION ID: " + id);

        return service.processApplication(id);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }
}