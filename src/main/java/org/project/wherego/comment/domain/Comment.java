package org.project.wherego.comment.domain;

import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.common.domain.BaseEntity;
import org.project.wherego.community.domain.Community;
import org.project.wherego.member.domain.Member;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY) // 댓글이 달린 게시글
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;


    @Column(nullable = false)
    private String content; // 댓글 내용
}