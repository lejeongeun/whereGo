package org.project.wherego.member.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindPwdRequest {
    private String email;
    private String nickname;
    private String newPassword;
}
