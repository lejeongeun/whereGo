package org.project.wherego.community.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.domain.CommunityImage;
import org.project.wherego.community.dto.CommunityRequestDto;
import org.project.wherego.community.dto.CommunityResponseDto;
import org.project.wherego.community.dto.ImageDto;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.global.s3.S3Service;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    private static final String COMMUNITY_IMAGE_FOLDER = "community/";

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

        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                String key = COMMUNITY_IMAGE_FOLDER + UUID.randomUUID() + getExtension(file.getOriginalFilename());
                try {
                    String s3Url = s3Service.uploadFile(key, file);
                    CommunityImage image = CommunityImage.builder()
                            .imageUrl(s3Url)
                            .community(community)
                            .build();
                    community.getImages().add(image);
                    log.info("✅ 업로드된 S3 URL: {}", s3Url);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드 실패", e);
                }
            }
        }

        communityRepository.save(community);

    }

    @Transactional
    public void edit(Long id, String email, CommunityRequestDto requestDto, List<MultipartFile> newImages, List<Long> deleteImageIds) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        if (!community.getMember().getEmail().equals(email)) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        // 제목, 내용 수정
        community.setTitle(requestDto.getTitle());
        community.setContent(requestDto.getContent());

        // 삭제할 이미지 처리
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            List<CommunityImage> toRemove = new ArrayList<>();
            for (CommunityImage image : community.getImages()) {
                if (deleteImageIds.contains(image.getId())) {
                    deleteS3Image(image.getImageUrl());
                    image.setCommunity(null);
                    toRemove.add(image);
                }
            }
            community.getImages().removeAll(toRemove);
        }

        // 새 이미지 추가
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile file : newImages) {
                String key = COMMUNITY_IMAGE_FOLDER + UUID.randomUUID() + getExtension(file.getOriginalFilename());
                try {
                    String s3Url = s3Service.uploadFile(key, file);
                    CommunityImage image = CommunityImage.builder()
                            .imageUrl(s3Url)
                            .community(community)
                            .build();
                    community.getImages().add(image);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드 실패", e);
                }
            }
        }
    }

    // 삭제 하기
    @Transactional
    public void delete (Long id, String email){
        Community community = communityRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다. "));
        if (!community.getMember().getEmail().equals(email)){
            throw new SecurityException("작성자만 삭제 가능합니다.");
        }
        for (CommunityImage image : community.getImages()) {
            deleteS3Image(image.getImageUrl());
        }

        communityRepository.delete(community);
    }
    @Transactional
    public void increaseViewCount(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        community.setViewCount(community.getViewCount() + 1);
    }
    @Transactional(readOnly = true)
    public Page<CommunityResponseDto> getAllPages(Pageable pageable) {
        Page<Community> page = communityRepository.findByIsDeletedFalse(pageable);
        return page.map(CommunityResponseDto::from);
    }
    @Transactional(readOnly = true)
    public CommunityResponseDto getPosts(Long id) {
        Community community = communityRepository.findWithAllById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시물 존재하지 않습니다."));
        communityRepository.save(community);
        return CommunityResponseDto.from(community);
    }

    // 확장자 추출
    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf("."));
    }

    // S3 이미지 삭제
    private void deleteS3Image(String imageUrl) {
        try {
            String key = imageUrl.substring(imageUrl.indexOf("community/"));
            s3Service.deleteFile(key);
            log.info("✅ S3 이미지 삭제 완료: {}", key);
        } catch (Exception e) {
            log.warn("❌ S3 이미지 삭제 실패: {}", imageUrl);
        }
    }
}
