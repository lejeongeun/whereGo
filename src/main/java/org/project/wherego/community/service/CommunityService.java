package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;


    public void create(CommunityRequestDto requestDto) {

        Community community = Community.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .userId(1L) // 테스트용 임시 설정
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();
        communityRepository.save(community);

    }

    public List<CommunityResponseDto> getAllPosts(){
        List<Community> communities = communityRepository.findAll();

        return communities.stream()
                .map(community -> CommunityResponseDto.builder()
                        .id(community.getId())
                        .title(community.getTitle())
                        .content(community.getContent())
                        .userId(community.getUserId())
                        .createdAt(community.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }


}
