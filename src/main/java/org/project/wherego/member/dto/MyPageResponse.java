package org.project.wherego.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.project.wherego.checklist.dto.CheckListGroupDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.schedule.dto.ScheduleResponseDto;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyPageResponse {
    private String email;
    private String nickname;
    private String profileImage;
    private List<CommunityResponseDto> comunities;
    private List<ScheduleResponseDto> schedules;
    private List<CheckListGroupDto> checklists;
}
