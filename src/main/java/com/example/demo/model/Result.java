package com.example.demo.model;

import java.time.Instant;

import org.springframework.jmx.export.annotation.ManagedAttribute;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "result")
public class Result {
    @Id
    private String idResult;
    private long area; // dien tich
    private String name;
    private String description; // mo ta cua bac si hoac ghi chu
    private long time; // so lan kham
    private Instant createdAt; // thoi gian tao ket qua

    // n result -> 1 user
    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    public String getIdResult() {
        return idResult;
    }

    public void setIdResult(String idResult) {
        this.idResult = idResult;
    }

    public long getArea() {
        return area;
    }

    public void setArea(long area) {
        this.area = area;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

}
