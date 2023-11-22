package de.nilzbu.demo.domain.dayvalues;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DayValuesRepository extends JpaRepository<DayValues, UUID> {
}
