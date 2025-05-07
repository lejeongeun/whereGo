package org.project.wherego.like.controller;

import lombok.RequiredArgsConstructor;
import org.project.wherego.like.service.LikeService;
import org.project.wherego.member.config.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community/{postId}/like")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;


    @PostMapping
    public ResponseEntity<?> toggleLike(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails){
        likeService.toggleLike(userDetails.getMember().getEmail(), postId);
        return ResponseEntity.ok("좋아요 토글 완료");
    }

    @GetMapping("/count")
    public ResponseEntity<?> getLikeCount(@PathVariable Long postId){
        Long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }
}
