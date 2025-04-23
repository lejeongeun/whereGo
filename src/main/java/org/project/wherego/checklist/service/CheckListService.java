package org.project.wherego.checklist.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.domain.Checklist;
import org.project.wherego.checklist.dto.CheckListDto;
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
    private final CheckListRepository checkListRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void create(CheckListDto requestDto, String email){
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        Checklist checklist = Checklist.builder()
                .itemName(requestDto.getItemName())
                .isChecked(false)
                .member(member)
                .build();
        checkListRepository.save(checklist);
    }

    @Transactional
    public List<CheckListDto> allList(){
        List<Checklist> checklists = checkListRepository.findAll();

        return checklists.stream().map(
                checklist -> CheckListDto.builder()
                        .itemName(checklist.getItemName())
                        .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public void editCheckList(Long id, CheckListDto requestDto, String email) {

        Checklist checklist = checkListRepository.findById(id).orElseThrow(
                ()-> new IllegalArgumentException("항목이 존재하지 않습니다")
        );

        if (!checklist.getMember().getEmail().equals(email)){
            throw new IllegalArgumentException("자신의 댓글만 수정 가능합니다.");
        }
        checklist.setItemName(requestDto.getItemName());


    }

    @Transactional
    public void delete(Long id){
        checkListRepository.deleteById(id);
    }


}
