package org.project.wherego.community.repository;

import org.project.wherego.community.domain.Community;
import org.project.wherego.member.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    @EntityGraph(attributePaths = {"member", "images", "likes", "comments"})
    Page<Community> findByIsDeletedFalse(Pageable pageable); // 삭제 안 된 글만 페이징 처리

    @EntityGraph(attributePaths = {"member", "images", "likes", "comments"})
    Optional<Community> findWithAllById(Long id); // 상세 조회용

    List<Community> findByMemberAndIsDeletedFalse(Member member);

    void deleteByMember(Member member);
}
