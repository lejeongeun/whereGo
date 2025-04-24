package org.project.wherego.like.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.like.domain.Like;
import org.project.wherego.like.repository.LikeRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {
    private LikeRepository likeRepository;
    private MemberRepository memberRepository;
    private CommunityRepository communityRepository;


    public void toggleLike(String email, Long postId) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("정보 조회가 불가능 합니다."));
        Community community = communityRepository.findById(postId).orElseThrow(
                ()-> new IllegalArgumentException("게시글이 존재하지 않습니다.")
        );
        likeRepository.findByMemberAndCommunity(member, community)
                .ifPresentOrElse(
                        likeRepository::delete,
                        ()->{
                            Like like = Like.builder()
                                    .member(member)
                                    .community(community)
                                    .build();
                            likeRepository.save(like);
                        }
                );
    }


    public Long getLikeCount(Long postId) {
        Community community = communityRepository.findById(postId)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return likeRepository.countByCommunity(community);
    }
}
