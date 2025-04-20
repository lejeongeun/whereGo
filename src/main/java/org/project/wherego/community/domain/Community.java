package org.project.wherego.community.domain;
import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.common.domain.BaseEntity;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Community extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false)
    private String title; // 게시글 제목

    @Lob
    @Column(nullable = false)
    private String content; // 게시글 내용

    @Column(nullable = false)
    private Long userId; // Member의 PK

    @Column(nullable = false)
    private Boolean isDeleted = false; // 삭제 여부

}