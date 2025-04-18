package org.project.wherego.member.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.domain.User;
import org.project.wherego.member.dto.UserDto;
import org.project.wherego.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public UserDto login(UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());

        Optional<User> loginUser = memberRepository.findById(user.getId());
        if (loginUser.isPresent()) {
            if (loginUser.get().getPassword().equals(user.getPassword())) {
//                return loginUser.get();
            }
        }
        return null;
    }
}
