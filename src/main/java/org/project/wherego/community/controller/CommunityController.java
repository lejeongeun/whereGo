package org.project.wherego.community.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
    private final CommunityService communityService;

    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<String> create(@Valid @RequestBody CommunityRequestDto requestDto){
        communityService.create(requestDto);
        return ResponseEntity.ok("게시글이 성공적으로 작성되었습니다.");
    }

    // 게시글 전체 확인
    @GetMapping("/list")
    public ResponseEntity<List<CommunityResponseDto>> getAllPosts(){
        List<CommunityResponseDto> allPosts = communityService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }
    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> edit (@PathVariable Long id, @Valid @RequestBody CommunityRequestDto requestDto){
        communityService.edit(id, requestDto.getTitle(), requestDto.getContent());
        return ResponseEntity.ok("글 수정 완료");
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete (@PathVariable Long id){
        communityService.delete(id);
        return ResponseEntity.ok("게시글 삭제 완료");
    }

}
