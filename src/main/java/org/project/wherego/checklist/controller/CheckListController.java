package org.project.wherego.checklist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.dto.CheckListDto;
import org.project.wherego.checklist.dto.CheckListGroupDto;
import org.project.wherego.checklist.service.CheckListService;
import org.project.wherego.member.config.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/group")
public class CheckListController {
    private final CheckListService checkListService;

    // 그룹 생성
    @PostMapping("/create")
    public ResponseEntity<String> groupCreate (@Valid @RequestBody CheckListGroupDto requestDto,
                                               @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        checkListService.create(requestDto, email);
        return ResponseEntity.ok("체크리스트 생성 완료");
    }

    // 그룹별 항목 생성
    @PostMapping("/{id}/addItem")
    public ResponseEntity<String> addItem(@PathVariable("id") Long groupId,
                                          @Valid @RequestBody CheckListDto requestDto){
        checkListService.addItem(groupId, requestDto);
        return ResponseEntity.ok("item 추가");

    }

    // 그룹 수정
    @PutMapping("/{id}/edit")
    public ResponseEntity<?> groupEdit(@PathVariable Long id, @Valid @RequestBody CheckListGroupDto requestDto,
                                       @AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        checkListService.groupEdit(id, requestDto, email);

        return ResponseEntity.ok("그룹 수정 완료");
    }


    // 항목 수정
    @PutMapping("/{id}/item/{itemId}/edit")
    public ResponseEntity<?> editItem(@PathVariable("id") Long groupId,
                                      @Valid @RequestBody CheckListDto requestDto,
                                      @PathVariable("itemId") Long itemId,
                                      @AuthenticationPrincipal CustomUserDetails userDetails){

        String email = userDetails.getMember().getEmail();
        checkListService.editItem(groupId, itemId, requestDto, email);
        return ResponseEntity.ok("체크리스트 수정 완료");
    }

    // 그룹 삭제
    @DeleteMapping("/{groupId}/delete")
    public ResponseEntity<?> deleteGroup (@PathVariable Long groupId){
        checkListService.deleteGroup(groupId);
        return ResponseEntity.ok(groupId+"그룹 삭제 완료");
    }

    // 항목식제
    @DeleteMapping("/{groupId}/delete/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long groupId,
                                        @PathVariable Long itemId){
        checkListService.delete(groupId, itemId);
        return ResponseEntity.ok(itemId+"번 항목 삭제 완료");
    }

    // 전체조회
    @GetMapping("/allList")
    public ResponseEntity<List<CheckListGroupDto>> groupAllList(){
        List<CheckListGroupDto> getAllList = checkListService.groupAllList();
        return ResponseEntity.ok(getAllList);
    }

}
