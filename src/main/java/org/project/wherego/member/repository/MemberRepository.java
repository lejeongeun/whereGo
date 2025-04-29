package org.project.wherego.member.repository;

import org.project.wherego.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Member> findByEmailAndNickname(String email, String nickname);

    boolean existsByNickname(String nickname);
}
