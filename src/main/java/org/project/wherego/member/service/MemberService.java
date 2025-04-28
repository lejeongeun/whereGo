package org.project.wherego.member.service;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.project.wherego.checklist.repository.CheckListGroupRepository;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.member.config.FileStorageProperties;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.dto.*;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final CheckListGroupRepository checklistGroupRepository;
    private final CommunityRepository communityRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageProperties fileStorageProperties;
    private final HttpServletRequest request; // HttpServletRequest를 사용하여 세션 정보에 접근
    private String absoluteUploadDir;

    @PostConstruct
    public void init() { // 절대경로 설정
        String uploadDir = fileStorageProperties.getUploadDir();
        System.out.println("uploadDir: " + uploadDir);
        this.absoluteUploadDir = new File(System.getProperty("user.dir"), uploadDir).getAbsolutePath(); //user.dir"는 현재 작업 디렉토리
        System.out.println("absoluteUploadDir: " + this.absoluteUploadDir); // 디버깅 로그
    }

    // 회원가입
    public SignupRequest insert(SignupRequest signupRequest) {
        // String security : 이메일 중복 체크
        if (memberRepository.existsByEmail(signupRequest.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }

        // String security : 닉네임 중복 체크
        if (memberRepository.existsByNickname(signupRequest.getNickname())){
            throw new IllegalArgumentException("이미 존재하는 닉네임 입니다.");
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
        request.getSession().invalidate(); //  세션 무효화
        SecurityContextHolder.clearContext(); // 인증 정보 삭제
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

        return new MyPageResponse(member.getEmail(), member.getNickname(), member.getProfileImage(), communityDtos);
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


    public void uploadProfileImage(Member member, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        // 사용자별 디렉토리 생성 (예: /uploads/user@example.com/)
        String userDir = absoluteUploadDir + File.separator + member.getEmail();
        Files.createDirectories(Paths.get(userDir));

        // 기존 DB랑 디렉토리에 path랑 이미지가 있으면 삭제
        if (member.getProfileImage() != null) {
            Files.deleteIfExists(Paths.get(member.getProfileImage()));
        }

        // 파일 이름 생성 (중복 방지를 위해 UUID 사용)
        String originalFileName = file.getOriginalFilename(); // image1
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // .jpg
        String newFileName = UUID.randomUUID().toString() + fileExtension; // 1sd2fsf4fdfsdf.jpg
        String filePath = userDir + File.separator + newFileName; // uploads/1sd2fsf4fdfsdf.jpg

        // 파일 저장
        file.transferTo(new File(filePath));

        // Member 엔티티에 파일 경로 저장
        member.setProfileImage(filePath);
        memberRepository.save(member);

    }

    @Transactional //  데이터베이스 작업을 하나의 트랜잭션으로 묶어 처리하고, 오류 발생 시 전체 작업을 롤백
    public ResponseEntity<String> deleteMember(Member member) {
            checklistGroupRepository.deleteByMember(member); // 외래키 데이터 삭제
            communityRepository.deleteByMember(member); // 외래키 데이터 삭제

            memberRepository.delete(member); // 삭제
            request.getSession().invalidate();
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok("계정이 정상적으로 삭제되었습니다.");
    }


    public ChangeNickRequest changeNickName(Member member, ChangeNickRequest nickNameRequest) {
        Optional<Member> OpUser = memberRepository.findByEmail(member.getEmail());

        if (!memberRepository.existsByNickname(nickNameRequest.getOldNickname())) {
            throw new IllegalArgumentException("기존 닉네임이 일치하지 않습니다.");
        }

        if (memberRepository.existsByNickname(nickNameRequest.getNewNickname())){
            throw new IllegalArgumentException("이미 존재하는 닉네임 입니다.");
        }

        if (OpUser.isPresent()) {
            Member m = OpUser.get();

            m.setNickname(nickNameRequest.getNewNickname());

            memberRepository.save(m);

            return nickNameRequest.builder()
                    .newNickname(m.getNickname())
                    .build();
        }
        throw new IllegalArgumentException("등록되어 있지 않은 닉네임입니다.");
    }
}
