package org.project.wherego.checklist.repository;

import org.project.wherego.checklist.domain.ChecklistGroup;
import org.project.wherego.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckListGroupRepository extends JpaRepository<ChecklistGroup, Long> {
    List<ChecklistGroup> findAllByMember(Member member);
}
