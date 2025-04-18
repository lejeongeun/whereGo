package org.project.wherego.member.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String nickname;
    private Date createAd = new Date();
}
