package org.project.wherego.comment.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.domain.Comment;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional
    public void commentCreate(CommentRequestDto requestDto){
        // 댓글 생성
        Comment newComment = Comment.builder()
                .boardId(requestDto.getBoardId()) // 초기값 임의 설정 ()
                .email(requestDto.getEmail())
                .content(requestDto.getContent())
                .build();

        commentRepository.save(newComment);
    }
    // 댓글 수정
    @Transactional
    public void commentEdit(Long id, String content){
        // 기존 댓글 확인
        Comment comment = commentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("댓글이 존재하지 않습니다."));
        // 댓글 수정
        comment.setContent(content);
    }

    // 댓글 삭제
    @Transactional
    public void commentDelete(Long id){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        commentRepository.delete(comment);

    }


}
