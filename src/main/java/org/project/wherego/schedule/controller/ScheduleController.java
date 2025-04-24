package org.project.wherego.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.project.wherego.schedule.service.ScheduleService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;



}
