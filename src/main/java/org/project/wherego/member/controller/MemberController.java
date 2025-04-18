package org.project.wherego.member.controller;

import org.project.wherego.member.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.project.wherego.member.service.MemberService;

@RestController
@RequestMapping("/api")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    PasswordEncoder pEncoder;

    @PostMapping("/login")
    public String login(@RequestBody UserDto userDto) {
        UserDto loginUser = memberService.login(userDto);
        if (loginUser != null && pEncoder.matches(userDto.getPassword(), loginUser.getPassword())) {
            // 토큰 자리
        }
        return "login";
    }

    @GetMapping("/logout")
    public String logout( ) {
        // 토큰 자리
        return "redirect:/";  // 홈 페이지로 리다이렉트
    }
}
