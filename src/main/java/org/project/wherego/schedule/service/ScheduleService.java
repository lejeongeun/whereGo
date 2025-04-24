package org.project.wherego.schedule.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.schedule.controller.ScheduleController;
import org.project.wherego.schedule.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private ScheduleRepository repository;
}
