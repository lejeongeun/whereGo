package org.project.wherego.schedule.repository;

import org.project.wherego.member.domain.Member;
import org.project.wherego.schedule.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByMember(Member member);

    List<Schedule> findByMember(Member member);
}
