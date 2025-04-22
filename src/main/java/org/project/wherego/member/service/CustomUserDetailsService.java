package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.domain.User;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

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
