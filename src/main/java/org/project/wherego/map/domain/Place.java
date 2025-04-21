package org.project.wherego.map.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.project.wherego.common.domain.BaseEntity;
import org.project.wherego.member.domain.User;

@Entity
@Data
public class Place extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double latitude;
    private double longitude;
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private User user;

}
