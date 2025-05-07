package org.project.wherego.community.repository;

import org.project.wherego.community.domain.Community;
import org.project.wherego.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByMemberAndIsDeletedFalse(Member member);

    void deleteByMember(Member member);
}
