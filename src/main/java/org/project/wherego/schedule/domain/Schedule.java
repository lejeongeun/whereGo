package org.project.wherego.schedule.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false)
    private Long userId; // 작성자 ID

    @Column(nullable = false)
    private String title; // 일정 제목

    private String description; // 일정 설명

    @Column(nullable = false)
    private LocalDateTime startDate; // 시작 날짜

    @Column(nullable = false)
    private LocalDateTime endDate; // 끝나는 날짜
}