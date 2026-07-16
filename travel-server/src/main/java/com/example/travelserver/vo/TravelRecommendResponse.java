package com.example.travelserver.vo;

import java.util.List;

import lombok.Data;

@Data
public class TravelRecommendResponse {
    private Boolean success;
    private String message;
    private String destination;
    private Integer budget;
    private Integer days;
    private String title;
    private String summary;
    private List<String> highlights;
    private List<DayItinerary> itinerary;
    private BudgetBreakdown budgetBreakdown;
    private List<String> tips;
    private List<String> notices;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Integer getBudget() {
        return budget;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<String> highlights) {
        this.highlights = highlights;
    }

    public List<DayItinerary> getItinerary() {
        return itinerary;
    }

    public void setItinerary(List<DayItinerary> itinerary) {
        this.itinerary = itinerary;
    }

    public BudgetBreakdown getBudgetBreakdown() {
        return budgetBreakdown;
    }

    public void setBudgetBreakdown(BudgetBreakdown budgetBreakdown) {
        this.budgetBreakdown = budgetBreakdown;
    }

    public List<String> getTips() {
        return tips;
    }

    public void setTips(List<String> tips) {
        this.tips = tips;
    }

    public List<String> getNotices() {
        return notices;
    }

    public void setNotices(List<String> notices) {
        this.notices = notices;
    }

    @Data
    public static class BudgetBreakdown {
        private Integer hotel;
        private Integer food;
        private Integer transport;
        private Integer tickets;
        private Integer other;

        public Integer getHotel() {
            return hotel;
        }

        public void setHotel(Integer hotel) {
            this.hotel = hotel;
        }

        public Integer getFood() {
            return food;
        }

        public void setFood(Integer food) {
            this.food = food;
        }

        public Integer getTransport() {
            return transport;
        }

        public void setTransport(Integer transport) {
            this.transport = transport;
        }

        public Integer getTickets() {
            return tickets;
        }

        public void setTickets(Integer tickets) {
            this.tickets = tickets;
        }

        public Integer getOther() {
            return other;
        }

        public void setOther(Integer other) {
            this.other = other;
        }
    }

    @Data
    public static class DayItinerary {
        private Integer day;
        private Segment morning;
        private Segment afternoon;
        private Segment evening;

        public Integer getDay() {
            return day;
        }

        public void setDay(Integer day) {
            this.day = day;
        }

        public Segment getMorning() {
            return morning;
        }

        public void setMorning(Segment morning) {
            this.morning = morning;
        }

        public Segment getAfternoon() {
            return afternoon;
        }

        public void setAfternoon(Segment afternoon) {
            this.afternoon = afternoon;
        }

        public Segment getEvening() {
            return evening;
        }

        public void setEvening(Segment evening) {
            this.evening = evening;
        }
    }

    @Data
    public static class Segment {
        private String period;
        private String title;
        private String duration;
        private String ticket;
        private String transport;
        private String desc;

        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getTicket() {
            return ticket;
        }

        public void setTicket(String ticket) {
            this.ticket = ticket;
        }

        public String getTransport() {
            return transport;
        }

        public void setTransport(String transport) {
            this.transport = transport;
        }

        public String getDesc() {
            return desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }
    }
}