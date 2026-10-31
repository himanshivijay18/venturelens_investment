package com.venturelens.repository;

import com.venturelens.entity.PitchDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PitchDeckRepository extends JpaRepository<PitchDeck, Long> {
    Optional<PitchDeck> findByStartupId(Long startupId);
    boolean existsByStartupId(Long startupId);
    void deleteByStartupId(Long startupId);
}
