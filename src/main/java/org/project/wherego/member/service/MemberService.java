package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.domain.User;
import org.project.wherego.member.dto.ChangePwdRequest;
import org.project.wherego.member.dto.MyPageResponse;
import org.project.wherego.member.dto.SignupRequest;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;


    // 회원가입
    public SignupRequest insert(SignupRequest signupRequest) {
        // String security : 이메일 중복 체크
        if (memberRepository.existsByEmail(signupRequest.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }
        String enPass = passwordEncoder.encode(signupRequest.getPassword());

        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(enPass) // 요청 데이터 자체가 아닌 암호화 후 설정
                .nickname((signupRequest.getNickname()))
                .build();

        User savedUser = memberRepository.save(user);

        return SignupRequest.builder()
                .email(savedUser.getEmail())
                .password(savedUser.getPassword())
                .nickname(savedUser.getNickname())
                .build();
    }

    public Authentication authenticate(String email, String password) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }

    public void logout() {
        SecurityContextHolder.clearContext(); // 세션 삭제
    }

    public MyPageResponse mypageInfo(String email) {
        User user = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다."));

        return new MyPageResponse(user.getEmail(), user.getPassword(), user.getNickname());
    }

    public ChangePwdRequest changwPwd(ChangePwdRequest changePwdRequest) {
        Optional<User> OpUser = memberRepository.findByEmail(changePwdRequest.getEmail());

        if (OpUser.isPresent()) {
            User user = OpUser.get();

            String enPass = passwordEncoder.encode(changePwdRequest.getNewPwd());
            user.setPassword(enPass);

            memberRepository.save(user);

            return changePwdRequest.builder()
                    .email(user.getEmail())
                    .newPwd(user.getPassword())
                    .build();
        }
        throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");
    }

}
