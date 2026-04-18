package com.example.review.controller;

import com.example.review.model.Order;
import com.example.review.model.OrderItem;
import com.example.review.model.Product;
import com.example.review.repository.OrderRepository;
import com.example.review.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        String userName = (String) payload.get("userName");
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

        Order order = new Order();
        order.setUserName(userName);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("DELIVERED");

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> item : items) {
            Long pid = Long.valueOf(item.get("productId").toString());
            Product p = productRepository.findById(pid).orElseThrow();

            OrderItem oi = new OrderItem();
            oi.setProductId(p.getId());
            oi.setProductName(p.getName());
            oi.setQuantity(1);
            oi.setPriceAtPurchase(p.getPrice());
            orderItems.add(oi);
            total += p.getPrice();

            p.setQuantity(p.getQuantity() - 1);
            productRepository.save(p);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/user/{userName}")
    public List<Order> getUserOrders(@PathVariable String userName) {
        return orderRepository.findByUserName(userName);
    }
}