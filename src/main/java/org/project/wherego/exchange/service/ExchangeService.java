package org.project.wherego.exchange.service;

import lombok.RequiredArgsConstructor;
import org.project.wherego.exchange.repository.ExchangeRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExchangeService {
    private final ExchangeRepository exchangeRepository;
}
