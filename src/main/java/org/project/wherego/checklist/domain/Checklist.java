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
    private String item; // 체크리스트 항목

    @Column(nullable = false)
    private Boolean isChecked = false; // 체크 여부

    @ManyToOne
    private ChecklistGroup group;
}