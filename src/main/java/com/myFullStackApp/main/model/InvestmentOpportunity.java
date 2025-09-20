package com.myFullStackApp.main.model;

import jakarta.persistence.*;

@Entity
@Table(name = "investment_opportunities")
public class InvestmentOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String risk;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String learnMoreUrl;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getRisk() {
        return risk;
    }

    public String getDescription() {
        return description;
    }

    public String getLearnMoreUrl() {
        return learnMoreUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setRisk(String risk) {
        this.risk = risk;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLearnMoreUrl(String learnMoreUrl) {
        this.learnMoreUrl = learnMoreUrl;
    }

}
