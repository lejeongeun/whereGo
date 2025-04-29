package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final MemberRepository memberRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public void create(CommunityRequestDto requestDto, String email, MultipartFile imageFile) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("회원이 존재하지 않습니다. 다시 로그인 해주세요."));

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()){
            imageUrl = saveImageFile(imageFile);
        }

        Community community = Community.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .member(member)
                .imageUrl(imageUrl)
                .isDeleted(false)
                .build();
        communityRepository.save(community);

    }

    // uploads 폴더를 절대경로로 잡아주는 메서드
    private String getAbsoluteUploadDir() {
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.isAbsolute()) {
            uploadFolder = new File(System.getProperty("user.dir"), uploadDir);
        }
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }
        return uploadFolder.getAbsolutePath();
    }
    // 이미지 저장
    private String saveImageFile(MultipartFile imageFile) {
        String originalFilename = imageFile.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = UUID.randomUUID() + extension;

        String absoluteUploadPath = getAbsoluteUploadDir(); // 절대경로 얻기
        File file = new File(absoluteUploadPath, newFileName);

        try{
            imageFile.transferTo(file);
        }catch (IOException e){
            throw new RuntimeException("이미지 저장 실패", e);
        }
        return "/uploads/" + newFileName;
    }
    @Transactional(readOnly = true)
    // 모든 게시물 가져오기
    public List<CommunityResponseDto> getAllPosts(){
        List<Community> communities = communityRepository.findAll();

        return communities.stream()
                .map(community -> {
                    return CommunityResponseDto.builder()
                            .id(community.getId())
                            .title(community.getTitle())
                            .content(community.getContent())
                            .imageUrl(community.getImageUrl())
                            .nickname(community.getMember().getNickname())
                            .createdAt(community.getCreatedAt())
                            .viewCount(community.getViewCount())
                            .likeCount(community.getLikes().size())
                            .commentCount(community.getComments().size())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 한개의 게시물 가져오기
    @Transactional(readOnly = true)
    public CommunityResponseDto getPosts(Long id, Member member) {
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시물 존재하지 않습니다."));
        Member members = memberRepository.findByEmail(member.getEmail())
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        community.setViewCount(community.getViewCount() + 1);
        communityRepository.save(community);

        return CommunityResponseDto.builder()
                .title(community.getTitle())
                .content(community.getContent())
                .nickname(members.getNickname())
                .createdAt(community.getCreatedAt())
                .viewCount(community.getViewCount())
                .likeCount(community.getLikes().size()) // 좋아요 수
                .commentCount(community.getComments().size()) // 댓글 수
                .imageUrl(community.getImageUrl())
                .build();
    }

    // 수정하기
    @Transactional
    public void edit(Long id,CommunityRequestDto requestDto){
        // id로 기존 게시글 조회
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다. "));

        // title, content, 수정 날짜 반영 후 자동 저장
        community.setTitle(requestDto.getTitle());
        community.setContent(requestDto.getContent());

    }
    // 삭제 하기
    @Transactional
    public void delete (Long id){
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다. "));
        communityRepository.delete(community);
    }

}
