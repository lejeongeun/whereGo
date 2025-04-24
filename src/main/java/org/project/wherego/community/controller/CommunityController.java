package org.project.wherego.community.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Array;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.service.CommunityService;
import org.project.wherego.member.config.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
    private final CommunityService communityService;

    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<String> create(@Valid @RequestBody CommunityRequestDto requestDto,
                                         @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        communityService.create(requestDto, email);
        return ResponseEntity.ok("게시글이 성공적으로 작성되었습니다.");
    }

    // 게시글 전체 확인
    @GetMapping("/list")
    public ResponseEntity<List<CommunityResponseDto>> getAllPosts(@AuthenticationPrincipal CustomUserDetails userDetails){
        List<CommunityResponseDto> allPosts = communityService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    // 하나의 게시물 조회
    @GetMapping("/{id}")
    public ResponseEntity<CommunityResponseDto> getPost(@PathVariable Long id,
                                                        @AuthenticationPrincipal CustomUserDetails userDetails){
        CommunityResponseDto post = communityService.getPosts(id, userDetails.getMember());
        return ResponseEntity.ok(post);

    }

    // 게시글 수정
    @PutMapping("/{id}/edit")
    public ResponseEntity<String> edit (@PathVariable Long id, @Valid @RequestBody CommunityRequestDto requestDto){
        communityService.edit(id,requestDto);
        return ResponseEntity.ok("글 수정 완료");
    }

    // 게시글 삭제
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> delete (@PathVariable Long id){
        communityService.delete(id);
        return ResponseEntity.ok("게시글 삭제 완료");
    }

}
