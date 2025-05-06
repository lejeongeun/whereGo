package org.project.wherego.schedule.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.project.wherego.schedule.domain.Schedule;
import org.project.wherego.schedule.dto.ScheduleRequestDto;
import org.project.wherego.schedule.dto.ScheduleResponseDto;
import org.project.wherego.schedule.repository.ScheduleRepository;
import org.project.wherego.map.domain.Place;
import org.project.wherego.map.repository.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;
    private final PlaceRepository placeRepository;


    public Schedule createSchedule(String email,
                                   ScheduleRequestDto requestDto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()->new IllegalArgumentException("사용자 정보 없음"));

        Schedule schedule = Schedule.builder()
                .title(requestDto.getTitle())
                // .description(requestDto.getDescription()) // description 주석처리
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .member(member)
                .build();
        return scheduleRepository.save(schedule);
    }

    // 일정에 등록된 장소 조회
    @Transactional
    public List<Place> getSchedulePlaces(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다."));

        return schedule.getPlaces();
    }

    public List<ScheduleResponseDto> getSchedules(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("사용자 없음, 다시 로그인 해주세요"));

        return scheduleRepository.findAllByMember(member).stream()
                .map(schedule -> ScheduleResponseDto.builder()
                        .id(schedule.getId())
                        .title(schedule.getTitle())
                        .description(schedule.getDescription())
                        .startDate(schedule.getStartDate())
                        .endDate(schedule.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }


    public void deleteSchedule(Long scheduleId, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("사용자 없음, 다시 로그인 해주세요"));

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(()-> new IllegalArgumentException("일정이 존재하지 않습니다. 다시 확인하여 주시오"));

        log.info("Schedule ID {} 삭제 시작. 연관된 Places 개수 = {}", schedule.getId(), schedule.getPlaces().size());
        scheduleRepository.delete(schedule);
        log.info("Schedule ID {} 삭제 완료", scheduleId);


    }
}