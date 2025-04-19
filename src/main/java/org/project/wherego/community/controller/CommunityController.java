package org.project.wherego.community.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
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

    @PostMapping("/create")
    public ResponseEntity<String> create(@Valid @RequestBody CommunityRequestDto requestDto){
        communityService.create(requestDto);
        return ResponseEntity.ok("게시글이 성공적으로 작성되었습니다.");
    }
    @GetMapping("/list")
    public ResponseEntity<List<CommunityResponseDto>> getAllPosts(){
        List<CommunityResponseDto> allPosts = communityService.getAllPosts();
        return ResponseEntity.ok(allPosts);

    }



}
