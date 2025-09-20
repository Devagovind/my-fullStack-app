package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.model.InvestmentOpportunity;
import com.myFullStackApp.main.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @GetMapping
    public List<InvestmentOpportunity> getAllOpportunities() {
        return investmentService.getAllOpportunities();
    }
}
