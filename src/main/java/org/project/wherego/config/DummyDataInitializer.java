package org.project.wherego.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.wherego.comment.domain.Comment;
import org.project.wherego.comment.repository.CommentRepository;
import org.project.wherego.community.domain.Community;
import org.project.wherego.community.repository.CommunityRepository;
import org.project.wherego.like.domain.Like;
import org.project.wherego.like.repository.LikeRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@Profile("local") // 로컬 프로파일에서만 진행
@RequiredArgsConstructor
public class DummyDataInitializer implements CommandLineRunner {
    private final MemberRepository memberRepository;
    private final CommunityRepository communityRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args){
        log.info("더미데이터 생성 시작");
        if (communityRepository.count() >= 3000){
            log.info("이미 더미데이터가 존재합니다. 생성을 건너뜁니다.");
            return;
        }
        // 멤버 5명 생성
        List<Member> members = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            String email = "user" + i + "@wherego.com";
            String nickname = "user" + i;
            Member member = Member.builder()
                    .email(email)
                    .nickname(nickname)
                    .password(passwordEncoder.encode("1234"))
                    .build();
            members.add(memberRepository.save(member));
        }

        List<Community> allPosts = new ArrayList<>();
        List<Comment> allComments = new ArrayList<>();
        List<Like> allLikes = new ArrayList<>();

        // 게시글 3,000개 이상 생성
        for (int i = 1; i < 3000; i++) {
            Member author = getRandomMember(members);
            Community post = Community.builder()
                    .title(i + "번째 더미 게시글 제목입니다.")
                    .content(i + "더미 게시글 본문입니다.")
                    .member(author)
                    .isDeleted(false)
                    .viewCount((long) random.nextInt(100)) // 랜덤 조회수
                    .build();

            allPosts.add(post);
        }
        communityRepository.saveAll(allPosts);

        // 댓글 10,000개 생성
        for (int i = 1; i <= 10000; i++) {
            Member commenter = getRandomMember(members);
            Community targetPost = getRandomPost(allPosts);
            Comment comment = Comment.builder()
                    .member(commenter)
                    .community(targetPost)
                    .content(i + "번째 테스트 댓글입니다.")
                    .build();

            allComments.add(comment);
        }
        commentRepository.saveAll(allComments);

        // 좋아요 수 랜덤 0-5개씩 생성
        for (Community post : allPosts) {
            int likeCount = random.nextInt(6); // 0~6개 이내
            Set<Long> likedMemberIds = new HashSet<>();
            for (int i = 0; i < likeCount; i++) {
                Member liker = getRandomMember(members);
                if (likedMemberIds.add(liker.getId())){
                    Like like = Like.builder()
                            .member(liker)
                            .community(post)
                            .build();
                    allLikes.add(like);
                }
            }
        }
        likeRepository.saveAll(allLikes);
        log.info("더미데이터 생성 완료 : 게시글 = {}, 댓글 = {}, 좋아요 = {}",
                allPosts.size(), allComments.size(), allLikes.size());

    }

    private Member getRandomMember(List<Member> members){
        return members.get(random.nextInt(members.size()));
    }

    private Community getRandomPost(List<Community> posts){
        return posts.get(random.nextInt(posts.size()));
    }
}
