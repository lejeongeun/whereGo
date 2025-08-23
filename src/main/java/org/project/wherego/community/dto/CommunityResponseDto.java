package org.project.wherego.community.dto;

import lombok.*;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.domain.CommunityImage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


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

    public static CommunityResponseDto from(Community community){
        return CommunityResponseDto.builder()
                .id(community.getId())
                .title(community.getTitle())
                .content(community.getContent())
                .nickname(community.getMember().getNickname())
                .email(community.getMember().getEmail())
                .createdAt(community.getCreatedAt())
                .viewCount(community.getViewCount())
                .likeCount(community.getLikes().size())
                .commentCount(community.getComments().size())
                .imageUrls(community.getImages().stream()
                        .map(image -> ImageDto.builder()
                                .id(image.getId())
                                .url(image.getImageUrl())
                                .build()).collect(Collectors.toList()))
                .profileImage(community.getMember().getProfileImage())
                .build();
    }
}
