package com.venturelens.repository;

import com.venturelens.entity.SavedStartup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedStartupRepository extends JpaRepository<SavedStartup, Long> {
    List<SavedStartup> findByInvestorIdOrderByCreatedAtDesc(Long investorId);
    Optional<SavedStartup> findByInvestorIdAndStartupId(Long investorId, Long startupId);
    boolean existsByInvestorIdAndStartupId(Long investorId, Long startupId);
    void deleteByInvestorIdAndStartupId(Long investorId, Long startupId);
    long countByInvestorId(Long investorId);
}
