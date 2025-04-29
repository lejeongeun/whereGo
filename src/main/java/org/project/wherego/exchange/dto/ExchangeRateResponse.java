package org.project.wherego.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeRateResponse { // 환율 조회 API의 응답 데이터 저장
    private String base;
    private String target;
    private Double rate;
    private String timestamp;

    public ExchangeRateResponse(String base, String target, Double rate) {
        this.base = base;
        this.target = target;
        this.rate = rate;
    }
}
