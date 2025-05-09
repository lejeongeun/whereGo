package org.project.wherego.comment.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.domain.Comment;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.dto.CommentResponseDto;
import org.project.wherego.comment.repository.CommentRepository;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.project.wherego.websocket.notification.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommunityRepository communityRepository;
    private final MemberRepository memberRepository;
    private final NotificationService notificationService;


    @Transactional
    public void commentCreate(Long communityId, CommentRequestDto requestDto, String email){
        Member member = memberRepository.findByEmail(email).orElseThrow(()->
                new IllegalArgumentException("회원이 존재하지 않습니다."));

        Community community = communityRepository.findById(communityId)
                .orElseThrow(()-> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        // 댓글 생성
        Comment newComment = Comment.builder()
                .member(member)
                .community(community)
                .content(requestDto.getContent())
                .build();

        commentRepository.save(newComment);

        // 게시글 작성자
        Member postOwner = community.getMember();

        // 자기 자신이 댓글을 단 경우는 알림 X
        if (!member.getId().equals(postOwner.getId())) {
            String message = "🔔 \"" + community.getTitle() + "\" 게시물에 댓글이 등록되었습니다!";
            notificationService.sendNotificationToUser(postOwner.getEmail(), message);
        }
    }

    // 댓글 조회
    @Transactional
    public List<CommentResponseDto> getComment(Long communityId){
        List<Comment> commentList = commentRepository.findAllByCommunityId(communityId);

        return commentList.stream()
                .map(comment -> CommentResponseDto.builder()
                        .commentId(comment.getId())
                        .nickname(comment.getMember().getNickname())
                        .email(comment.getMember().getEmail())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .profileImage(comment.getMember().getProfileImage())
                .build()
        ).collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public void commentEdit(Long commentId,CommentRequestDto requestDto, String email){
        // 기존 댓글 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()-> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getMember().getEmail().equals(email)){
            throw new IllegalArgumentException("본인 댓글만 수정 가능합니다.");
        }

        // 댓글 수정
        comment.setContent(requestDto.getContent());
        commentRepository.save(comment);
    }

    // 댓글 삭제
    @Transactional
    public void commentDelete(Long commentId, String email){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()-> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getMember().getEmail().equals(email)){
            throw new IllegalArgumentException("본인 댓글만 삭제 가능합니다.");
        }

        commentRepository.delete(comment);
    }
}
