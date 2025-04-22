package org.project.wherego.checklist.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.domain.Checklist;
import org.project.wherego.checklist.dto.CheckListDto;
import org.project.wherego.checklist.repository.CheckListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckListService {
    private final CheckListRepository checkListRepository;

    @Transactional
    public void create(CheckListDto requestDto){
        Checklist checklist = Checklist.builder()
                .itemName(requestDto.getItemName())
                .isChecked(true)
                .userId(1L) // 임시
                .build();
        checkListRepository.save(checklist);
    }

    @Transactional
    public List<CheckListDto> allList(){
        List<Checklist> checklists = checkListRepository.findAll();

        return checklists.stream().map(
                checklist -> CheckListDto.builder()
                        .id(checklist.getId())
                        .itemName(checklist.getItemName())
                        .isChecked(checklist.getIsChecked())
                        .userId(checklist.getUserId())
                        .build()
        ).collect(Collectors.toList());
    }



}
