package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void create(CommunityRequestDto requestDto, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("회원이 존재하지 않습니다. 다시 로그인 해주세요."));

        Community community = Community.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .member(member)
                .isDeleted(false)
                .build();
        communityRepository.save(community);

    }
    // 모든 게시물 가져오기
    public List<CommunityResponseDto> getAllPosts(){
        List<Community> communities = communityRepository.findAll();

        return communities.stream()
                .map(community -> {
                    return CommunityResponseDto.builder()
                            .id(community.getId())
                            .title(community.getTitle())
                            .content(community.getContent())
                            .nickname(community.getMember().getNickname())
                            .createdAt(community.getCreatedAt())
                            .viewCount(community.getViewCount())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 한개의 게시물 가져오기
    public CommunityResponseDto getPosts(Long id, Member member) {
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시물 존재하지 않습니다."));
        Member members = memberRepository.findByEmail(member.getEmail())
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        community.setViewCount(community.getViewCount() + 1);
        communityRepository.save(community);

        return CommunityResponseDto.builder()
                .title(community.getTitle())
                .content(community.getContent())
                .nickname(members.getNickname())
                .createdAt(community.getCreatedAt())
                .viewCount(community.getViewCount())
                .build();
    }

    // 수정하기
    @Transactional
    public void edit(Long id,CommunityRequestDto requestDto){
        // id로 기존 게시글 조회
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다. "));

        // title, content, 수정 날짜 반영 후 자동 저장
        community.setTitle(requestDto.getTitle());
        community.setContent(requestDto.getContent());

    }
    // 삭제 하기
    @Transactional
    public void delete (Long id){
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다. "));
        communityRepository.delete(community);
    }



}
