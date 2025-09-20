package com.myFullStackApp.main.repository;
import com.myFullStackApp.main.model.InvestmentOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestmentOpportunityRepository extends JpaRepository<InvestmentOpportunity, Long> {
}