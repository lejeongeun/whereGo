package org.project.wherego.member.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangeNickRequest {
    private String oldNickname;
    private String newNickname;
}
