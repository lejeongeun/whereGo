package org.project.wherego.comment.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    private Long commentId;
    private String nickname;
    private String content; // 댓글 내용
    private LocalDateTime createdAt;
}
