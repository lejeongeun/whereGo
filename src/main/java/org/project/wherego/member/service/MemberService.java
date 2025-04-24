package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.dto.ChangePwdRequest;
import org.project.wherego.member.dto.FindPwdRequest;
import org.project.wherego.member.dto.MyPageResponse;
import org.project.wherego.member.dto.SignupRequest;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final CommunityRepository communityRepository;
    private final PasswordEncoder passwordEncoder;


    // 회원가입
    public SignupRequest insert(SignupRequest signupRequest) {
        // String security : 이메일 중복 체크
        if (memberRepository.existsByEmail(signupRequest.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }
        String enPass = passwordEncoder.encode(signupRequest.getPassword());

        Member member = Member.builder()
                .email(signupRequest.getEmail())
                .password(enPass) // 요청 데이터 자체가 아닌 암호화 후 설정
                .nickname((signupRequest.getNickname()))
                .build();

        Member savedMember = memberRepository.save(member);

        return SignupRequest.builder()
                .email(savedMember.getEmail())
                .password(savedMember.getPassword())
                .nickname(savedMember.getNickname())
                .build();
    }

    public void logout() {
        SecurityContextHolder.clearContext(); // 세션 삭제
    }

    public MyPageResponse mypageInfo(Member member) {
        List<Community> communities = communityRepository.findByMemberAndIsDeletedFalse(member);
        List<CommunityResponseDto> communityDtos = communities.stream()
                .map(community -> CommunityResponseDto.builder()
                        .id(community.getId())
                        .title(community.getTitle())
                        .content(community.getContent())
                        .nickname(community.getMember().getNickname()) // Member에서 nickname 가져오기
                        .createdAt(community.getCreatedAt()) // BaseEntity의 createdAt
                        .viewCount(community.getViewCount())
                        .build())
                .collect(Collectors.toList());

        return new MyPageResponse(member.getEmail(), member.getNickname(), communityDtos);
    }

    public ChangePwdRequest changwPwd(Member member, ChangePwdRequest pwdrequest) {
        Optional<Member> OpUser = memberRepository.findByEmail(member.getEmail());

        if (OpUser.isPresent()) {
            Member m = OpUser.get();

            if (!passwordEncoder.matches(pwdrequest.getOldPassword(), m.getPassword())) {
                throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
            }

            if (!pwdrequest.getNewPassword().equals(pwdrequest.getConfirmPassword())) {
                throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
            }

            String enPass = passwordEncoder.encode(pwdrequest.getNewPassword());
            m.setPassword(enPass);

            memberRepository.save(m);

            return pwdrequest.builder()
                    .newPassword(m.getPassword())
                    .build();
        }
        throw new IllegalArgumentException("등록되어 있지 않은 이메일입니다.");
    }

    public FindPwdRequest findPassword(FindPwdRequest pwdrequest) {
        Optional<Member> OpUser = memberRepository.findByEmailAndNickname(pwdrequest.getEmail(), pwdrequest.getNickname());
        if (OpUser.isPresent()) {
            Member m = OpUser.get();

            String enPass = passwordEncoder.encode(pwdrequest.getNewPassword());
            m.setPassword(enPass);

            memberRepository.save(m);

            return pwdrequest.builder()
                    .newPassword(m.getPassword())
                    .build();
        }
        throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");

    }
}
