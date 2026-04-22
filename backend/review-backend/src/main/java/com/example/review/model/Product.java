package com.example.review.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Integer quantity = 50;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String imageUrl;
}
