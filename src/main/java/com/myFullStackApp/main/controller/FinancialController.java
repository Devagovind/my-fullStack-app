// FILE: src/main/java/com/myFullStackApp/main/controller/FinancialController.java
package com.myFullStackApp.main.controller;

import com.myFullStackApp.main.service.FinancialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/finances")
public class FinancialController {

    @Autowired
    private FinancialService financialService;

    @GetMapping("/summary")
    public Map<String, BigDecimal> getFinancialSummary(Authentication authentication) {
        return financialService.getFinancialSummary(authentication.getName());
    }

    @DeleteMapping("/reset")
    public ResponseEntity<Void> resetAllFinances(Authentication authentication) {
        financialService.resetAllFinances(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}