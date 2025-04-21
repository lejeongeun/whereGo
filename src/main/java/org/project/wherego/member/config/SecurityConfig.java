package org.project.wherego.member.config;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.service.MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final MemberService memberService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // SPA에서는 CSRF 비활성화 (필요 시 활성화)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/signup").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex // 인가되지 않은 페이지에 들어갈 시
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // 401 응답
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login") // REST API 로그인 엔드포인트
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value()); // JSON 성공 응답
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"로그인 성공\", \"username\": \"" + authentication.getName() + "\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value()); // JSON 실패 응답
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"유효하지 않은 이메일 혹은 비밀번호 입니다.\"}");
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"로그아웃 성공\"}");
                        })
                        .invalidateHttpSession(true) // 세션 무효화
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                )
                .sessionManagement(session -> session // 세션 관리
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                        .expiredSessionStrategy(event -> {
                            event.getResponse().setStatus(HttpStatus.UNAUTHORIZED.value()); // 401
                            event.getResponse().setContentType("application/json");
                            event.getResponse().getWriter().write("{\"error\": \"세션 만료\"}");
                        })
                );

        return http.build();
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return memberService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
