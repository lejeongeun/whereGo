package org.project.wherego.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.project.wherego.community.dto.CommunityResponseDto;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyPageResponse {
    private String email;
    private String nickname;
    private List<CommunityResponseDto> comunities;
}
