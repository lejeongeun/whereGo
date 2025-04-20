package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;

    @Transactional
    public void create(CommunityRequestDto requestDto) {

        Community community = Community.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .userId(1L) // 테스트용 임시 설정
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
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void edit(Long id, String title, String content){
        // id로 기존 게시글 조회
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다. "));


        // title, content, 수정 날짜 반영 후 자동 저장
        community.setTitle(title);
        community.setContent(content);

    }

    @Transactional
    public void delete (Long id){
        communityRepository.deleteById(id);
    }





}
