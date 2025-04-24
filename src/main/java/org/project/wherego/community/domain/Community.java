package org.project.wherego.community.domain;
import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.comment.domain.Comment;
import org.project.wherego.common.domain.BaseEntity;
import org.project.wherego.like.domain.Like;
import org.project.wherego.member.domain.Member;

import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Community extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK키

    @Column(nullable = false)
    private String title; // 게시글 제목

    @Lob
    @Column(nullable = false)
    private String content; // 게시글 내용

    @ManyToOne(fetch = FetchType.LAZY) // Member와 연관관계
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private Boolean isDeleted = false; // 삭제 여부

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    @Builder.Default
    private Long viewCount = 0L; // 조회수

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;


}