package org.project.wherego.member.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class SignupRequest {
    private String email;
    private String password;
    private String nickname;
    private Date createAd = new Date();
}
