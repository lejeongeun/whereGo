package org.project.wherego.comment.domain;

import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.common.domain.BaseEntity;

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

    @Column(nullable = false)
    private Long boardId; // 게시글 ID

    @Column(nullable = false)
    private String email; // 이메일

    @Column(nullable = false)
    private String content; // 댓글 내용
}