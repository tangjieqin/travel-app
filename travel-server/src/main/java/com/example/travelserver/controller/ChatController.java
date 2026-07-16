package com.example.travelserver.controller;

import com.example.travelserver.service.ChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestBody ChatRequest request) throws JsonProcessingException {
        return chatService.streamChat(request.getMessage());
    }

    @Data
    public static class ChatRequest {
        private String message;
        private List<ChatMessage> history;
    }
    
    @Data
    public static class ChatMessage {
        private String role;
        private String content;
    }
}