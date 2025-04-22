package org.project.wherego.member.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.member.dto.*;

import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.project.wherego.member.service.MemberService;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final Logger logger = Logger.getLogger(this.getClass().getName());

    //Valid : null 값 유효성 체크 자동
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest signupRequest) {
        SignupRequest u = memberService.insert(signupRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입 성공");
        response.put("email", u.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = memberService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(new LoginResponse("로그인 성공", authentication.getName()));
        } catch (AuthenticationException e) {
            logger.severe("로그인 인증 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("유효하지 않은 이메일 혹은 비밀번호 입니다."));
        } catch (Exception e) {
            logger.severe("알 수 없는 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        memberService.logout();
        return ResponseEntity.ok(new LogoutResponse("로그아웃 성공"));
    }

    @GetMapping("/mypage")          // 로그인된 사용자 정보 받기
    public ResponseEntity<?> mypageInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        MyPageResponse mypageresponse = memberService.mypageInfo(email);
        return ResponseEntity.ok(mypageresponse);
    }

    @PostMapping("/changePwd")
    public ResponseEntity<?> changePwd(@RequestBody ChangePwdRequest changePwdRequest) {
        try {
            memberService.changwPwd(changePwdRequest);
            return ResponseEntity.ok(new ChangePwdResponse("비밀번호 변경 성공", changePwdRequest.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("등록되어 있지 않은 이메일입니다."));
        }
    }
}

