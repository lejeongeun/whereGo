package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.domain.User;
import org.project.wherego.member.dto.LoginRequest;
import org.project.wherego.member.dto.SignupRequest;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public SignupRequest insert(SignupRequest signupRequest) {
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password((signupRequest.getPassword()))
                .nickname((signupRequest.getNickname()))
                .createAd((signupRequest.getCreateAd()))
                .build();

        // String security
//        if (userRepository.existsByEmail(request.getEmail())){
//            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
//        }

        return null;

    }

    public LoginRequest login(LoginRequest loginRequest) {
        User user = User.builder()
                        .email(loginRequest.getEmail())
                        .password(loginRequest.getPassword())
                        .build();

        Optional<User> loginUser = memberRepository.findById(user.getId());
        if (loginUser.isPresent()) {
            if (loginUser.get().getPassword().equals(user.getPassword())) {
//                return loginUser.get();
            }
        }
        return null;
    }

}
