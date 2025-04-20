package org.project.wherego.comment.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.domain.Comment;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.repository.CommentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public void commentCreate(CommentRequestDto requestDto){
        // 댓글 생성
        Comment newComment = Comment.builder()
                .boardId(1L) // 초기값 임의 설정
                .email(requestDto.getEmail())
                .content(requestDto.getContent())
                .build();

        commentRepository.save(newComment);
    }
    // 댓글 수정


    // 댓글 삭제


}
