package com.venturelens.repository;

import com.venturelens.entity.MeetingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRequestRepository extends JpaRepository<MeetingRequest, Long> {
    List<MeetingRequest> findByInvestorIdOrderByCreatedAtDesc(Long investorId);
    List<MeetingRequest> findByStartupIdOrderByCreatedAtDesc(Long startupId);
    List<MeetingRequest> findAllByOrderByCreatedAtDesc();

    Optional<MeetingRequest> findByInvestorIdAndStartupIdAndStatus(Long investorId, Long startupId, String status);
    boolean existsByInvestorIdAndStartupIdAndStatus(Long investorId, Long startupId, String status);

    long countByStartupId(Long startupId);
    long countByInvestorId(Long investorId);
    long countByInvestorIdAndStatus(Long investorId, String status);

    long countByStatus(String status);

    @Query("SELECT m.status, COUNT(m) FROM MeetingRequest m GROUP BY m.status")
    List<Object[]> countRequestsByStatus();
}
