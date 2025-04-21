package org.project.wherego.checklist.domain;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private Long userId; // user id
}
