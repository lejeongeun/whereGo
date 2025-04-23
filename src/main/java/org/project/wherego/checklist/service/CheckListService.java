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
        Checklist item = itemRepository.findById(groupId).orElseThrow(
                ()-> new IllegalArgumentException("항목이 존재하지 않습니다")
        );
        if (!item.getGroup().getId().equals(groupId)){
            throw new IllegalArgumentException("그룹 아이디가 일치하지 않습니다.")
        }
        if (!item.getGroup().getMember().getEmail().equals(email)){
            throw new IllegalArgumentException("자신의 항목만 수정 가능합니다.");
        }

        item.setItem(requestDto.getItem());
        item.setIsChecked(requestDto.getIsChecked());



    }

    // 그룹 삭제


    // 항목 삭제
    @Transactional
    public void delete(Long id){
        itemRepository.deleteById(id);
    }

    @Transactional
    public List<CheckListGroupDto> groupAllList(){
        List<ChecklistGroup> checklistsGroup = groupRepository.findAll();

        return checklistsGroup.stream().map(
                group -> CheckListGroupDto.builder()
                        .title(group.getTitle())
                        .build()
        ).collect(Collectors.toList());
    }


}
