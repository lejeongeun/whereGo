package org.project.wherego.comment;

import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;
import org.project.wherego.board.domain.Board;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false)
    private Long boardId; // 게시글 ID

    @Column(nullable = false)
    private Long userId; // 작성자 ID

    @Column(nullable = false)
    private String content; // 댓글 내용
}