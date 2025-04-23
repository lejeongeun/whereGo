package org.project.wherego.schedule.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequestDto {
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Long> placeId;
}
