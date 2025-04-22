package org.project.wherego.comment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<String> commentCreate(@Valid @RequestBody CommentRequestDto requestDto){
        commentService.commentCreate(requestDto);
        return ResponseEntity.ok("댓글 생성 완료");
    }

    @GetMapping("/allList")
    public ResponseEntity<List<CommentRequestDto>> allCommentList(){
        List<CommentRequestDto> commentList= commentService.allCommentList();

        return ResponseEntity.ok(commentList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> commentEdit(@PathVariable Long id, @Valid @RequestBody CommentRequestDto requestDto){
        commentService.commentEdit(id, requestDto.getContent());
        return ResponseEntity.ok("댓글 수정 완료");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> commentDelete(@PathVariable Long id){
        commentService.commentDelete(id);
        return ResponseEntity.ok("댓글 삭제 완료");
    }



}
