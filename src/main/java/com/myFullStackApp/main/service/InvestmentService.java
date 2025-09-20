package com.myFullStackApp.main.service;

import com.myFullStackApp.main.model.InvestmentOpportunity;
import com.myFullStackApp.main.repository.InvestmentOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvestmentService {
    @Autowired
    private InvestmentOpportunityRepository repository;

    public List<InvestmentOpportunity> getAllOpportunities() {
        return repository.findAll();
    }
}
