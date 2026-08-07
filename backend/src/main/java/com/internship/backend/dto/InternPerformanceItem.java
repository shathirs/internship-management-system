package com.internship.backend.dto;

public class InternPerformanceItem {

    private String internId;
    private String name;
    private int score;

    public InternPerformanceItem() {
    }

    public InternPerformanceItem(String internId, String name, int score) {
        this.internId = internId;
        this.name = name;
        this.score = score;
    }

    public String getInternId() {
        return internId;
    }

    public void setInternId(String internId) {
        this.internId = internId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
