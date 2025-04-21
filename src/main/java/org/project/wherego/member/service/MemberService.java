package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.domain.User;
import org.project.wherego.member.dto.SignupRequest;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // 회원가입
    public SignupRequest insert(SignupRequest signupRequest) {
        // String security : 이메일 중복 체크
        if (memberRepository.existsByEmail(signupRequest.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }

        User user = User.builder()
                .email(signupRequest.getEmail())
                .password((signupRequest.getPassword()))
                .nickname((signupRequest.getNickname()))
                .createAd((signupRequest.getCreateAd()))
                .build();

        User savedUser = memberRepository.save(user);

        SignupRequest result = SignupRequest.builder()
                .email(savedUser.getEmail())
                .password(savedUser.getPassword())
                .nickname(savedUser.getNickname())
                .createAd(savedUser.getCreateAd())
                .build();

        return result;
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

    // UserDetailsService의 필수 메서드 구현
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("이메일로 사용자를 찾을 수 없습니다: " + email));
        return new org.springframework.security.core.userdetails.User( //사용자 인증에 필요한 정보를 캡슐화(이메일, 비번, 권한 등)
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // 권한 목록 (필요 시 추가)
        );
    }


}
