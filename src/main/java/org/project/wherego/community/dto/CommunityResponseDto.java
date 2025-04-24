package org.project.wherego.community.dto;

import lombok.*;

import java.time.LocalDateTime;


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
}
