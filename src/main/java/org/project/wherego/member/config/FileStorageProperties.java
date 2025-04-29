package org.project.wherego.member.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file") // application.yml에서 file.upload-dir 속성 값을 매핑.
@Getter
@Setter
public class FileStorageProperties {
    private String uploadDir;
}
