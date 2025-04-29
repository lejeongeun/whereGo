package org.project.wherego.map.repository;

import org.project.wherego.map.domain.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByScheduleId(Long scheduleId);
}
