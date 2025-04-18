package org.project.wherego.board.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false)
    private Long userId; // 작성자 ID

    @Column(nullable = false)
    private String title; // 제목

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 내용
}