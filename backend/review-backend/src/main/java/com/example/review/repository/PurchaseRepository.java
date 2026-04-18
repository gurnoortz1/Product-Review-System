package com.example.review.repository;

import com.example.review.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserId(Long userId);
    Optional<Purchase> findByUserIdAndProductId(Long userId, Long productId);
}