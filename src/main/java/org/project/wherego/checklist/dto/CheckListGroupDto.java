package org.project.wherego.checklist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckListGroupDto {
    private Long id;
    
    @NotBlank(message = "제목은 필수입니다.")
    private String title;
    
    private List<CheckListDto> items;
}
