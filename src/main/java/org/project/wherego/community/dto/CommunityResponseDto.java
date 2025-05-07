package org.project.wherego.community.dto;

import lombok.*;
import org.project.wherego.community.domain.CommunityImage;

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

    private List<ImageDto> imageUrls; // 다중 이미지 지원
    private String profileImage;
    private String email; // 작성자 이메일
}
