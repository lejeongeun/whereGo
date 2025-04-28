package org.project.wherego.checklist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckListDto {

    @NotBlank(message = "항목 이름은 필수입니다.")
    private String item;
    private Boolean isChecked;
    private Long groupId; // 그룹 id

}
