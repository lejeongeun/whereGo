package org.project.wherego.checklist.domain;

import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.member.domain.Member;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false)
    private String itemName; // 항목 이름

    @Column(nullable = false)
    private Boolean isChecked = false; // 체크 여부

    @ManyToOne(fetch = FetchType.LAZY) // 체크리스트 주인
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}