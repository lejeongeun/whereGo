package org.project.wherego.checklist.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.domain.Checklist;
import org.project.wherego.checklist.domain.ChecklistGroup;
import org.project.wherego.checklist.dto.CheckListDto;
import org.project.wherego.checklist.dto.CheckListGroupDto;
import org.project.wherego.checklist.repository.CheckListGroupRepository;
import org.project.wherego.checklist.repository.CheckListRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckListService {

    private final CheckListRepository itemRepository;
    private final CheckListGroupRepository groupRepository;
    private final MemberRepository memberRepository;

    // group 생성
    @Transactional
    public void create(CheckListGroupDto requestDto, String email){
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        ChecklistGroup group = ChecklistGroup.builder()
                .title(requestDto.getTitle())
                .member(member)
                .build();
        groupRepository.save(group);

        if (requestDto.getItems() != null && !requestDto.getItems().isEmpty()) {
            List<Checklist> items = requestDto.getItems().stream()
                    .map(itemDto -> Checklist.builder()
                            .item(itemDto.getItem())
                            .isChecked(false)
                            .group(group)
                            .build())
                    .collect(Collectors.toList());

            itemRepository.saveAll(items);
        }

    }

    // 그룹별 항목 추가
    @Transactional
    public void addItem(Long groupId, CheckListDto requestDto) {
        // 게시물이 있는지 점검
        ChecklistGroup group = groupRepository.findById(groupId)
                .orElseThrow(()-> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        Checklist item = Checklist.builder()
                .item(requestDto.getItem())
                .isChecked(false)
                .group(group)
                .build();

        itemRepository.save(item);
    }
    @Transactional
    // 그룹 수정
    public void groupEdit(Long id, CheckListGroupDto requestDto, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다. 로그인 후 시도해 주세요"));
        ChecklistGroup group = groupRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("자신의 체크리스트만 수정 가능합니다."));

        group.setTitle(requestDto.getTitle());
        groupRepository.save(group);
    }


    // 항목 수정
    @Transactional
    public void editItem(Long groupId, Long itemId, CheckListDto requestDto, String email) {
        // email로 사용자, 항목 확인 -> item 변경
        Checklist item = itemRepository.findById(itemId).orElseThrow(
                ()-> new IllegalArgumentException("항목이 존재하지 않습니다")
        );
        if (!item.getGroup().getId().equals(groupId)){
            throw new IllegalArgumentException("그룹 아이디가 일치하지 않습니다.");
        }
        if (!item.getGroup().getMember().getEmail().equals(email)){
            throw new IllegalArgumentException("자신의 항목만 수정 가능합니다.");
        }

        item.setItem(requestDto.getItem());

        itemRepository.save(item);

    }

    // 그룹 삭제
    @Transactional
    public void deleteGroup(Long groupId) {
        ChecklistGroup group = groupRepository.findById(groupId)
                .orElseThrow(()-> new IllegalArgumentException("체크리스트를 다시 선택해 주세요."));

        groupRepository.delete(group);
    }


    // 항목 삭제
    @Transactional
    public void delete(Long groupId, Long itemId){
        // 항목 존재하는지 확인
        Checklist item = itemRepository.findById(itemId)
                .orElseThrow(()-> new IllegalArgumentException("해당 항목이 존재하지 않습니다."));
        // 해당 그룹이 존재하는지 확인
        if (!item.getGroup().getId().equals(groupId)){
            throw new IllegalArgumentException("해당 그룹이 일치하지 않습니다. 다시 시도하여 주세요");
        }
        // 삭제
        itemRepository.deleteById(itemId);
    }

    @Transactional
    public List<CheckListGroupDto> groupAllList(String email){
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));
        
        List<ChecklistGroup> checklistsGroup = groupRepository.findAllByMember(member);

        return checklistsGroup.stream().map(
                group -> CheckListGroupDto.builder()
                        .id(group.getId())
                        .title(group.getTitle())
                        .items(group.getItems().stream()
                                .map(item -> CheckListDto.builder()
                                        .id(item.getId())
                                        .groupId(item.getGroup().getId())
                                        .item(item.getItem())
                                        .isChecked(item.getIsChecked())
                                        .build())
                                .collect(Collectors.toList()))
                        .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public void toggleItem(Long groupId, Long itemId) {
        Checklist checklist = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("항목이 존재하지 않습니다."));
        
        // 그룹 ID 검증
        if (!checklist.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("잘못된 그룹 ID입니다.");
        }
        
        // 체크 상태 토글
        checklist.setIsChecked(!checklist.getIsChecked());
    }
}
