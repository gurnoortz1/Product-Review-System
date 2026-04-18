package com.example.review.config;

import com.example.review.model.Product;
import com.example.review.model.Purchase;
import com.example.review.model.User;
import com.example.review.repository.ProductRepository;
import com.example.review.repository.PurchaseRepository;
import com.example.review.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private PurchaseRepository purchaseRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createUserIfNotExists("admin@sportsshop.com", "Admin", "ADMIN");

        User u1 = createUserIfNotExists("gurnoor11@gmail.com", "Gurnoor", "USER");
        User u2 = createUserIfNotExists("abhishek22@gmail.com", "Abhishek", "USER");
        User u3 = createUserIfNotExists("gaurav33@gmail.com", "Gaurav", "USER");
        User u4 = createUserIfNotExists("aditya44@gmail.com", "Aditya", "USER");
        User u5 = createUserIfNotExists("amit55@gmail.com", "Amit", "USER");

        if (productRepository.count() == 0) {
            loadProducts();
        }

        createPurchase(u1.getId(), 1L);
        createPurchase(u2.getId(), 5L);
        createPurchase(u2.getId(), 6L);
        createPurchase(u3.getId(), 3L);
        createPurchase(u4.getId(), 7L);
        createPurchase(u5.getId(), 6L);
    }

    private User createUserIfNotExists(String email, String displayName, String role) {
        if (!userRepository.findByUsername(email).isPresent()) {
            User user = new User();
            user.setUsername(email);
            user.setPassword(passwordEncoder.encode("A12345"));
            user.setRole(role);
            user.setEnabled(true);
            userRepository.save(user);
            System.out.println("Created user: " + email);
            return user;
        } else {
            System.out.println("User already exists: " + email);
            return userRepository.findByUsername(email).get();
        }
    }

    private void loadProducts() throws Exception {
        // Read images from text files in src/main/resources
        String img1 = loadImage("img1.txt");
        String img2 = loadImage("img2.txt");
        String img3 = loadImage("img3.txt");
        String img4 = loadImage("img4.txt");
        String img5 = loadImage("img5.txt");
        String img6 = loadImage("img6.txt");
        String img7 = loadImage("img7.txt");

        Product pBoxingRed = createProduct("Pro Boxing Gloves - Red", "Boxing", img1, 2499.00);
        Product pBoxingBlue = createProduct("Pro Boxing Gloves - Blue", "Boxing", img2, 2499.00);
        Product pMMA4 = createProduct("MMA Gloves 4oz", "MMA", img3, 1499.00);
        Product pMMA6 = createProduct("MMA Gloves 6oz", "MMA", img4, 1699.00);
        Product pFootball = createProduct("Football Size 5", "Football", img5, 899.00);
        Product pBag = createProduct("Heavy Punching Bag", "Equipment", img6, 5999.00);
        Product pMouthguard = createProduct("Professional Mouthguard", "Accessories", img7, 499.00);

        List<Product> allProducts = List.of(pBoxingRed, pBoxingBlue, pMMA4, pMMA6, pFootball, pBag, pMouthguard);
        productRepository.saveAll(allProducts);
        System.out.println("Products loaded successfully!");
    }

    // Helper method to read large strings from files
    private String loadImage(String filename) throws Exception {
        ClassPathResource resource = new ClassPathResource(filename);
        byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
        return new String(bytes);
    }

    private Product createProduct(String name, String category, String imageUrl, Double price) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        p.setPrice(price);
        p.setQuantity(50);
        return p;
    }

    private void createPurchase(Long userId, Long productId) {
        Purchase pur = new Purchase();
        pur.setUserId(userId);
        pur.setProductId(productId);
        pur.setPurchaseDate(LocalDateTime.now());
        purchaseRepository.save(pur);
    }
}