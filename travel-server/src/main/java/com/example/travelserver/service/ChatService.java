package com.example.travelserver.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface ChatService {
    SseEmitter streamChat(String message) throws JsonProcessingException;
}