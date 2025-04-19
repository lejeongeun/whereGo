package org.project.wherego.community.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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



}
