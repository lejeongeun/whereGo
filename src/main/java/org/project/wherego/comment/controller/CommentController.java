package org.project.wherego.comment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.comment.dto.CommentRequestDto;
import org.project.wherego.comment.service.CommentService;
import org.project.wherego.member.config.CustomUserDetails;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.service.CustomUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/{communityId}/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<String> commentCreate(@PathVariable Long communityId, @Valid @RequestBody CommentRequestDto requestDto,
                                                @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        commentService.commentCreate(communityId, requestDto, email);
        return ResponseEntity.ok("댓글 생성 완료");
    }

    @GetMapping("/allList")
    public ResponseEntity<List<CommentRequestDto>> allCommentList(@PathVariable Long communityId){
        List<CommentRequestDto> commentList = commentService.allCommentList(communityId);
        return ResponseEntity.ok(commentList);
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<String> commentEdit(@PathVariable("id") Long commentId,
                                              @Valid @RequestBody CommentRequestDto requestDto,
                                              @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        commentService.commentEdit(commentId, requestDto, email);
        return ResponseEntity.ok("댓글 수정 완료");
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> commentDelete(@PathVariable("id") Long commentId,
                                                @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        commentService.commentDelete(commentId, email);
        return ResponseEntity.ok("댓글 삭제 완료");
    }



}
