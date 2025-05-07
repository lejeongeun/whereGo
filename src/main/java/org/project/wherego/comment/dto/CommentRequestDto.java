package org.project.wherego.comment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequestDto {
    private Long communityId;
    private String nickname;
    private String content; // 댓글 내용
}
