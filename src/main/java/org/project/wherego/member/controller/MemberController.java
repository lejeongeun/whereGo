package org.project.wherego.member.controller;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.dto.LoginRequest;
import org.project.wherego.member.dto.SignupRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.project.wherego.member.service.MemberService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final PasswordEncoder pEncoder;

    @PostMapping("/signup")
    public String signup(SignupRequest signupRequest) {
        String enPass = pEncoder.encode(signupRequest.getPassword());
        signupRequest.setPassword(enPass);

        SignupRequest u = memberService.insert(signupRequest);
        return "redirect:/";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        LoginRequest loginUser = memberService.login(loginRequest);
        if (loginUser != null && pEncoder.matches(loginRequest.getPassword(), loginUser.getPassword())) {
            // 토큰 자리
        }
        return "login";
    }

    @GetMapping("/logout")
    public String logout( ) {
        // 토큰 자리(삭제)
        return "redirect:/";  // 홈 페이지로 리다이렉트
    }


}
