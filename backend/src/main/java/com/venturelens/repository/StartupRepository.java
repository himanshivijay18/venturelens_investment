package com.venturelens.repository;

import com.venturelens.entity.Startup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StartupRepository extends JpaRepository<Startup, Long> {
    Optional<Startup> findByEmail(String email);
    boolean existsByEmail(String email);

    List<Startup> findByIsActiveTrue();

    @Query("SELECT s FROM Startup s WHERE s.isActive = true " +
           "AND (:category IS NULL OR :category = '' OR LOWER(s.category) = LOWER(:category)) " +
           "AND (:fundingStage IS NULL OR :fundingStage = '' OR LOWER(s.fundingStage) = LOWER(:fundingStage)) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.founderName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Startup> searchStartups(
        @Param("search") String search,
        @Param("category") String category,
        @Param("fundingStage") String fundingStage
    );

    @Query("SELECT s.category, COUNT(s) FROM Startup s GROUP BY s.category")
    List<Object[]> countStartupsByCategory();

    long countByIsActiveTrue();
}
