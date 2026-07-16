package com.example.travelserver.service.impl;

import com.example.travelserver.dto.TravelRequest;
import com.example.travelserver.service.TravelService;
import com.example.travelserver.util.LLMUtils;
import com.example.travelserver.vo.TravelRecommendResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TravelServiceImpl implements TravelService {

    @Value("${siliconflow.api-url}")
    private String apiUrl;

    @Value("${siliconflow.api-key}")
    private String apiKey;

    @Value("${siliconflow.model}")
    private String model;

    @Override
    public TravelRecommendResponse recommend(TravelRequest request) {
        String prompt = buildPrompt(request);
        
        try {
            String aiResponse = LLMUtils.callSiliconFlowApi(apiUrl, apiKey, model, prompt);
            log.info("AI响应: {}", aiResponse);
            return parseResponse(aiResponse, request);
        } catch (Exception e) {
            log.error("调用AI服务失败", e);
            TravelRecommendResponse response = new TravelRecommendResponse();
            response.setSuccess(false);
            response.setMessage("调用AI服务失败: " + e.getMessage());
            return response;
        }
    }

    private String buildPrompt(TravelRequest request) {
        return String.format(
            "请为我制定一份前往%s的旅行计划，预算%d元，旅行天数%d天。\n" +
            "请以JSON格式返回，包含以下字段：\n" +
            "- destination: 城市名\n" +
            "- budget: 总预算\n" +
            "- days: 天数\n" +
            "- title: 行程标题\n" +
            "- summary: 行程摘要\n" +
            "- highlights: [亮点列表]\n" +
            "- itinerary: [{day: 第几天, morning: {period: \"上午\", title: \"景点名称\", duration: \"时长\", ticket: \"门票信息\", transport: \"交通方式\", desc: \"详细描述\"}, afternoon: {...}, evening: {...}}]\n" +
            "- budgetBreakdown: {hotel: 住宿预算, food: 餐饮预算, transport: 交通预算, tickets: 门票预算, other: 其他预算}\n" +
            "- tips: [旅行小贴士列表]\n" +
            "- notices: [注意事项列表]",
            request.getCity(),
            request.getBudget(),
            request.getDays()
        );
    }

    private TravelRecommendResponse parseResponse(String aiResponse, TravelRequest request) {
        try {
            JsonNode root = LLMUtils.parseJson(aiResponse);
            TravelRecommendResponse response = new TravelRecommendResponse();
            
            response.setSuccess(true);
            response.setMessage("成功");
            response.setDestination(root.path("destination").asText(request.getCity()));
            response.setBudget(root.path("budget").asInt(request.getBudget()));
            response.setDays(root.path("days").asInt(request.getDays()));
            response.setTitle(root.path("title").asText(""));
            response.setSummary(root.path("summary").asText(""));

            if (root.has("highlights") && root.path("highlights").isArray()) {
                List<String> highlights = LLMUtils.convertJsonToList(root.path("highlights"), String.class);
                response.setHighlights(highlights);
            }

            if (root.has("itinerary") && root.path("itinerary").isArray()) {
                List<TravelRecommendResponse.DayItinerary> itineraries = LLMUtils.convertJsonToList(
                    root.path("itinerary"),
                    TravelRecommendResponse.DayItinerary.class
                );
                response.setItinerary(itineraries);
            }

            JsonNode budgetNode = root.path("budgetBreakdown");
            if (!budgetNode.isNull()) {
                TravelRecommendResponse.BudgetBreakdown budget = LLMUtils.convertJsonToObject(budgetNode, TravelRecommendResponse.BudgetBreakdown.class);
                response.setBudgetBreakdown(budget);
            }

            if (root.has("tips") && root.path("tips").isArray()) {
                List<String> tips = LLMUtils.convertJsonToList(root.path("tips"), String.class);
                response.setTips(tips);
            }

            if (root.has("notices") && root.path("notices").isArray()) {
                List<String> notices = LLMUtils.convertJsonToList(root.path("notices"), String.class);
                response.setNotices(notices);
            }

            return response;
        } catch (Exception e) {
            log.warn("解析AI响应JSON失败，返回原始文本: {}", e.getMessage());
            TravelRecommendResponse response = buildFallbackResponse(request, aiResponse);
            return response;
        }
    }

    private TravelRecommendResponse buildFallbackResponse(TravelRequest request, String aiResponse) {
        TravelRecommendResponse response = new TravelRecommendResponse();
        response.setSuccess(true);
        response.setDestination(request.getCity());
        response.setBudget(request.getBudget());
        response.setDays(request.getDays());
        response.setTitle(String.format("%s%d天深度游 · 预算%d元", request.getCity(), request.getDays(), request.getBudget()));
        response.setSummary("为您定制的" + request.getCity() + request.getDays() + "日行程方案");
        
        int transportBudget = Math.round(request.getBudget() * 0.25f);
        int hotelBudget = Math.round(request.getBudget() * 0.35f);
        int foodBudget = Math.round(request.getBudget() * 0.2f);
        int ticketsBudget = Math.round(request.getBudget() * 0.15f);
        int otherBudget = request.getBudget() - transportBudget - hotelBudget - foodBudget - ticketsBudget;
        
        TravelRecommendResponse.BudgetBreakdown budget = new TravelRecommendResponse.BudgetBreakdown();
        budget.setHotel(hotelBudget);
        budget.setFood(foodBudget);
        budget.setTransport(transportBudget);
        budget.setTickets(ticketsBudget);
        budget.setOther(otherBudget);
        response.setBudgetBreakdown(budget);
        
        response.setTips(List.of("建议提前预订热门景点门票", "出行前查看当地天气情况"));
        response.setNotices(List.of("注意保管好个人财物", "遵守景区规定"));
        
        return response;
    }

    @Override
    public SseEmitter recommendStream(TravelRequest request) throws JsonProcessingException {
        SseEmitter emitter = new SseEmitter(TimeUnit.SECONDS.toMillis(120));
        
        String prompt = String.format(
            "请为我制定一份前往%s的旅行计划，预算%d元，旅行天数%d天。请详细描述行程安排。",
            request.getCity(),
            request.getBudget(),
            request.getDays()
        );

        LLMUtils.callSiliconFlowApiStream(
            apiUrl,
            apiKey,
            model,
            prompt,
            chunk -> {
                try {
                    emitter.send(SseEmitter.event().data(chunk));
                } catch (Exception e) {
                    log.error("发送SSE事件失败", e);
                    emitter.completeWithError(e);
                }
            },
            error -> {
                log.error("流式调用失败", error);
                emitter.completeWithError(error);
            },
            () -> {
                emitter.complete();
                log.info("流式响应完成");
            }
        );

        emitter.onCompletion(() -> log.info("SSE连接完成"));
        emitter.onTimeout(() -> log.warn("SSE连接超时"));
        emitter.onError(e -> log.error("SSE连接错误", e));

        return emitter;
    }
}