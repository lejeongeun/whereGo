package org.project.wherego.comment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}")
    public ResponseEntity<String> commentEdit(@RequestBody CommentRequestDto requestDto){
        return ResponseEntity.ok("댓글 수정 완료");
    }



}
