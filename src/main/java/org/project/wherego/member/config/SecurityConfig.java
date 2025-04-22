package org.project.wherego.member.config;

import lombok.RequiredArgsConstructor;
import org.project.wherego.member.service.CustomUserDetailsService;
import org.project.wherego.member.service.MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.logging.Logger;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private static final Logger logger = Logger.getLogger(SecurityConfig.class.getName());
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // SPA에서는 CSRF 비활성화 (필요 시 활성화)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/signup").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex // 인가되지 않은 페이지에 들어갈 시
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // 401 응답
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
        return customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // React 프론트엔드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); // JSESSIONID 쿠키 허용
        configuration.setMaxAge(3600L); // Preflight 요청 캐싱 (1시간)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
