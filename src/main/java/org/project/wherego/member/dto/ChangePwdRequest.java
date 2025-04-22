package org.project.wherego.member.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePwdRequest {
    private String email;
    private String newPwd;
}
