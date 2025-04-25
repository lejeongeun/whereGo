package org.project.wherego.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.project.wherego.map.domain.Place;
import org.project.wherego.member.config.CustomUserDetails;
import org.project.wherego.schedule.domain.Schedule;
import org.project.wherego.schedule.dto.ScheduleRequestDto;
import org.project.wherego.schedule.dto.ScheduleResponseDto;
import org.project.wherego.schedule.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;
    // 일정 컴포넌트 생성
    @PostMapping("/createSchedule")
    public ResponseEntity<Schedule> createSchedule(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @RequestBody ScheduleRequestDto requestDto){
        String email = userDetails.getMember().getEmail();
        Schedule schedule = scheduleService.createSchedule(email, requestDto);
        return ResponseEntity.ok(schedule);
    }

    // 일정에 등록된 장소 조회
    @GetMapping("/{scheduleId}/getPlaces")
    public ResponseEntity<List<Place>> getSchedulePlaces(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(scheduleService.getSchedulePlaces(scheduleId));
    }

    // 전체 일정 리스트 조회
    @GetMapping("/allPlaces")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedules(@AuthenticationPrincipal CustomUserDetails userDetails){
        String email = userDetails.getMember().getEmail();
        List<ScheduleResponseDto> schedule = scheduleService.getSchedules(email);
        return ResponseEntity.ok(schedule);
    }

}
