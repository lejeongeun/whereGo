package org.project.wherego.community.dto;

import lombok.*;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityResponseDto {
    private Long id;
    private String title;
    private String content;
    private Long userId;
}
