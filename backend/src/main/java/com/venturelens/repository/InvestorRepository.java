package com.venturelens.repository;

import com.venturelens.entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestorRepository extends JpaRepository<Investor, Long> {
    Optional<Investor> findByEmail(String email);
    boolean existsByEmail(String email);

    List<Investor> findByIsActiveTrue();

    @Query("SELECT i FROM Investor i WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(i.investorName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.firmName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.interestedCategory) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Investor> searchInvestors(@Param("search") String search);

    long countByIsActiveTrue();
}
