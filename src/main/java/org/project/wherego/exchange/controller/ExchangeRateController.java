package org.project.wherego.exchange.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.project.wherego.exchange.dto.ConversionResponse;
import org.project.wherego.exchange.dto.ExchangeRateResponse;
import org.project.wherego.exchange.service.ExchangeRateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/exchange")
@RequiredArgsConstructor
public class ExchangeRateController {
    private final ExchangeRateService exchangeService;

    @GetMapping("/rate")
    public Mono<ExchangeRateResponse> getExchangeRate(
            @RequestParam(defaultValue = "USD") @NotBlank String base,
            @RequestParam(defaultValue = "KRW") @NotBlank String target) {
        return exchangeService.getExchangeRate(base, target);
    }

    @GetMapping("/convert")
    public Mono<ConversionResponse> convertAmount(
            @RequestParam(defaultValue = "USD") @NotBlank String from,
            @RequestParam(defaultValue = "KRW") @NotBlank String to,
            @RequestParam(defaultValue = "1") @Positive Double amount) {
        return exchangeService.convertAmount(from, to, amount);
    }

}
