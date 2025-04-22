package org.project.wherego.checklist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.dto.CheckListDto;
import org.project.wherego.checklist.service.CheckListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkList")
public class CheckListController {
    private final CheckListService checkListService;

    // 생성
    @PostMapping("/create")
    public ResponseEntity<String> create (@Valid @RequestBody CheckListDto requestDto){
        checkListService.create(requestDto);
        return ResponseEntity.ok("생성 완료");
    }

    // 조회
    @GetMapping("/allList")
    public ResponseEntity<List<CheckListDto>> allList(){
        List<CheckListDto> getAllList = checkListService.allList();
        return ResponseEntity.ok(getAllList);
    }

    // 수정

    // 식제

}
