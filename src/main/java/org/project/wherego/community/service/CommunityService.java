package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.domain.CommunityImage;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
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
    public void create(CommunityRequestDto requestDto, String email, List<MultipartFile> imageFiles) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("회원이 존재하지 않습니다. 다시 로그인 해주세요."));

        Community community = Community.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .member(member)
                .isDeleted(false)
                .build();


        if (imageFiles != null){
            for (MultipartFile imageFile : imageFiles){
                String imageUrl = saveImageFile(imageFile);
                CommunityImage image = CommunityImage.builder()
                        .imageUrl(imageUrl)
                        .community(community)
                        .build();
                community.getImages().add(image);
            }
        }
        communityRepository.save(community);

    }
    @Transactional
    public void edit(Long id, CommunityRequestDto requestDto, List<MultipartFile> newImages, List<Long> deleteImageIds) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        // 제목, 내용 수정
        community.setTitle(requestDto.getTitle());
        community.setContent(requestDto.getContent());

        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            List<CommunityImage> imagesToRemove = new ArrayList<>();
            for (CommunityImage image : community.getImages()) {
                if (deleteImageIds.contains(image.getId())) {
                    deleteImageFile(image.getImageUrl()); // 실제 이미지 삭제
                    image.setCommunity(null); // 연관관계 제거
                    imagesToRemove.add(image);
                }
            }
            community.getImages().removeAll(imagesToRemove);
        }

        // 새 이미지 추가
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile imageFile : newImages) {
                String imageUrl = saveImageFile(imageFile);
                CommunityImage image = CommunityImage.builder()
                        .imageUrl(imageUrl)
                        .community(community) // 연관관계 설정
                        .build();
                community.getImages().add(image);
            }
        }
    }
    @Transactional
    public void increaseViewCount(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        community.setViewCount(community.getViewCount() + 1);
    }

    @Transactional(readOnly = true)
    public List<CommunityResponseDto> getAllPosts() {
        return communityRepository.findAll().stream()
                .map(community -> CommunityResponseDto.builder()
                        .id(community.getId())
                        .title(community.getTitle())
                        .content(community.getContent())
                        .nickname(community.getMember().getNickname())
                        .createdAt(community.getCreatedAt())
                        .viewCount(community.getViewCount())
                        .likeCount(community.getLikes().size())
                        .commentCount(community.getComments().size())
                        .imageUrls(community.getImages().stream()
                                .map(CommunityImage::getImageUrl).collect(Collectors.toList()))
                        .profileImage(community.getMember().getProfileImage())
                        .build())
                .collect(Collectors.toList());

    }

    // 한개의 게시물 가져오기
    @Transactional(readOnly = true)
    public CommunityResponseDto getPosts(Long id, Member member) {
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시물 존재하지 않습니다."));

        Member members = memberRepository.findByEmail(member.getEmail())
                .orElseThrow(()-> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        communityRepository.save(community);

        return CommunityResponseDto.builder()
                .title(community.getTitle())
                .content(community.getContent())
                .nickname(members.getNickname())
                .createdAt(community.getCreatedAt())
                .viewCount(community.getViewCount())
                .likeCount(community.getLikes().size()) // 좋아요 수
                .commentCount(community.getComments().size()) // 댓글 수
                .imageUrls(community.getImages().stream().map(CommunityImage::getImageUrl).collect(Collectors.toList())) // 이미지
                .profileImage(community.getMember().getProfileImage())
                .build();
    }
    // 삭제 하기
    @Transactional
    public void delete (Long id){
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다. "));
        communityRepository.delete(community);
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

    // 이미지 파일 삭제
    private void deleteImageFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        try {
            // /uploads/abc.jpg → abc.jpg (상대경로 추출)
            String relativePath = imageUrl.replaceFirst("^/uploads/", "");

            // uploads/abc.jpg → 절대 경로
            Path path = Paths.get(getAbsoluteUploadDir(), relativePath);

            // 실제 파일 삭제
            Files.deleteIfExists(path);
            log.info("✅ 이미지 파일 삭제 성공: {}", path.toAbsolutePath());
        } catch (IOException e) {
            log.error("❌ 이미지 파일 삭제 실패: {}", e.getMessage());
        }
    }



}
