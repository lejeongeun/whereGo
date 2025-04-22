package org.project.wherego.exchange.controller;

import lombok.RequiredArgsConstructor;
import org.project.wherego.exchange.service.ExchangeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExchangeController {
    private final ExchangeService exchangeService;

}
