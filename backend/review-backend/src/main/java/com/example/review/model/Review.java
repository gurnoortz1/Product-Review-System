package com.example.review.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private Long productId;
    private String productName;
    private int rating;

    @Column(length = 2000)
    private String comment;

    private LocalDateTime createdAt;

    @Column(length = 2000)
    private String reply;

    private LocalDateTime replyDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}