package org.project.wherego.like.domain;

import jakarta.persistence.*;
import lombok.*;
import org.project.wherego.community.domain.Community;
import org.project.wherego.member.domain.Member;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "community_id"})
})

public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;


}
