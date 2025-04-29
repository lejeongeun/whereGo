package org.project.wherego.checklist.repository;

import org.project.wherego.checklist.domain.Checklist;
import org.project.wherego.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckListRepository extends JpaRepository<Checklist, Long> {
    List<Checklist> findByGroup_Id(Long groupId);
}
