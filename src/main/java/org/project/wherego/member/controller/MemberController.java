package org.project.wherego.member.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.member.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.project.wherego.member.service.MemberService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final PasswordEncoder pEncoder;

    //Valid : null 값 유효성 체크 자동
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest signupRequest) {
        SignupRequest u = memberService.insert(signupRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입 성공");
        response.put("email", u.getEmail());
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//        try {
//            Authentication authentication = memberService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
//            return ResponseEntity.ok(new LoginResponse("로그인 성공", authentication.getName()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new ErrorResponse("유효하지 않은 이메일 혹은 비밀번호 입니다."));
//        }
//    }


}
