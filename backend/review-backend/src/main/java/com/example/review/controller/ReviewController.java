package com.example.review.controller;

import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Map<String, Object> payload) {
        Review review = new Review();
        review.setUserName((String) payload.get("userName"));
        review.setProductId(Long.valueOf(payload.get("productId").toString()));
        review.setProductName((String) payload.get("productName"));
        review.setRating(Integer.valueOf(payload.get("rating").toString()));
        review.setComment((String) payload.get("comment"));
        review.setCreatedAt(LocalDateTime.now());

        if (payload.containsKey("reply")) {
            review.setReply((String) payload.get("reply"));
            review.setReplyDate(LocalDateTime.now());
        }

        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (payload.containsKey("reply")) {
            review.setReply((String) payload.get("reply"));
            review.setReplyDate(LocalDateTime.now());
        }

        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
