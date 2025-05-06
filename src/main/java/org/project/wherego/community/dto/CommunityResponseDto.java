package org.project.wherego.community.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityResponseDto {
    private Long id;
    private String title;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;

    private Long viewCount;
    private int likeCount;
    private int commentCount;

    private List<String> imageUrls; // 다중 이미지 지원
    private String profileImage;
    private String email; // 작성자 이메일
}
