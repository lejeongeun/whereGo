package org.project.wherego.checklist.repository;

import org.project.wherego.checklist.domain.Checklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckListRepository extends JpaRepository<Checklist, Long> {
}
