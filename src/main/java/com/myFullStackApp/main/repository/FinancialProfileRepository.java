package com.myFullStackApp.main.repository;

import com.myFullStackApp.main.model.FinancialProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FinancialProfileRepository extends JpaRepository<FinancialProfile, Long> {
    Optional<FinancialProfile> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}