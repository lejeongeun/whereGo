package org.project.wherego.member.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.wherego.member.config.CustomUserDetails;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.dto.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.project.wherego.member.service.MemberService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthenticationManager authenticationManager;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest dto, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(token);
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);

            // 명시적으로 세션에 SecurityContext 저장
            request.getSession(true)
                    .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            return ResponseEntity.ok(new LoginResponse("로그인 성공", authentication.getName()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "이메일 또는 비밀번호가 잘못되었습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        memberService.logout();
        return ResponseEntity.ok(new LogoutResponse("로그아웃 성공"));
    }

    @GetMapping("/mypage")          // 로그인된 사용자 정보 받기
    public ResponseEntity<?> mypageInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MyPageResponse mypageresponse = memberService.mypageInfo(userDetails.getMember());
        return ResponseEntity.ok(mypageresponse);
    }

    @PostMapping("/changePwd")
    public ResponseEntity<?> changePwd(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @RequestBody ChangePwdRequest Pwdrequest) {
        try {
            Member member = userDetails.getMember();
            memberService.changwPwd(member, Pwdrequest);
            return ResponseEntity.ok(new ChangePwdResponse("비밀번호 변경 성공", member.getEmail()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/findPwd")
    public ResponseEntity<?> findPwd(@RequestBody FindPwdRequest Pwdrequest) {
        try {
            memberService.findPassword(Pwdrequest);
            return ResponseEntity.ok(new ChangePwdResponse("비밀번호 변경 성공", Pwdrequest.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("닉네임 또는 이메일이 일치하지 않습니다."));
        }
    }

    @PostMapping("/mypage/upload")
    public ResponseEntity<String> uploadProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("file") MultipartFile file) {
        try {
            memberService.uploadProfileImage(userDetails.getMember(), file);
            return ResponseEntity.ok("프로필 이미지가 업로드 되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/mypage/deletion") // 마이페이지 회원탈퇴
    public ResponseEntity<String> deleteMember(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = userDetails.getMember();
        return memberService.deleteMember(member);
    }

    @PostMapping("/mypage/changeNick")
    public ResponseEntity<?> changePwd(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @RequestBody ChangeNickRequest nickNameRequest) {
        try {
            Member member = userDetails.getMember();
            memberService.changeNickName(member, nickNameRequest);
            return ResponseEntity.ok(new ChangeNickResponse("닉네임 변경 성공", member.getNickname()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("서버 오류가 발생했습니다."));
        }

    }

}

