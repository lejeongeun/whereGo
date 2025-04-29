package org.project.wherego.like.repository;

import org.project.wherego.community.domain.Community;
import org.project.wherego.like.domain.Like;
import org.project.wherego.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByMemberAndCommunity(Member member, Community community);
    Long countByCommunity(Community community);
    List<Like> findAllByCommunity(Community community);

}
