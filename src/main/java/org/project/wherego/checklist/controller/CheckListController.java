package org.project.wherego.checklist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.dto.CheckListDto;
import org.project.wherego.checklist.service.CheckListService;
import org.project.wherego.member.config.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkList")
public class CheckListController {
    private final CheckListService checkListService;

    // 생성
    @PostMapping("/create")
    public ResponseEntity<String> create (@Valid @RequestBody CheckListDto requestDto, @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        checkListService.create(requestDto, email);
        return ResponseEntity.ok("체크리스트 생성 완료");
    }

    // 조회
    @GetMapping("/allList")
    public ResponseEntity<List<CheckListDto>> allList(){
        List<CheckListDto> getAllList = checkListService.allList();
        return ResponseEntity.ok(getAllList);
    }

    // 수정
    @PutMapping("/{id}/edit")
    public ResponseEntity<?> editCheckList(@PathVariable Long id, CheckListDto requestDto,
                                           @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        checkListService.editCheckList(id, requestDto, email);
        return ResponseEntity.ok("체크리스트 수정 완료");
    }

    // 식제
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id){
        checkListService.delete(id);
        return ResponseEntity.ok("체크리스트 삭제 완료");
    }

}
