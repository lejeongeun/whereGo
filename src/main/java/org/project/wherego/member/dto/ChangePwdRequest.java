package org.project.wherego.member.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePwdRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
