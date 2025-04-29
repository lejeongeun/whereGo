package org.project.wherego.schedule.domain;

import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.map.domain.Place;
import org.project.wherego.member.domain.Member;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String title; // 일정 제목

    private String description; // 일정 설명

    @Column(nullable = false)
    private LocalDateTime startDate; // 시작 날짜

    @Column(nullable = false)
    private LocalDateTime endDate; // 끝나는 날짜

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Place> places = new ArrayList<>();
}