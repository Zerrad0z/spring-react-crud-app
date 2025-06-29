package com.example.crud_app.config;

import com.example.crud_app.dto.CategoryCreateDTO;
import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.enums.Role;
import com.example.crud_app.service.CategoryService;
import com.example.crud_app.service.ProductService;
import com.example.crud_app.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class DataInitializer {

    private final UserService userService;
    private final CategoryService categoryService;
    private final ProductService productService;

    public DataInitializer(UserService userService,
                           CategoryService categoryService,
                           ProductService productService) {
        this.userService = userService;
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @PostConstruct
    public void init() {
        // --- Create Users ---
        try {
            userService.createUser(new CreateUserDTO("admin", "123", Role.ADMIN));
            userService.createUser(new CreateUserDTO("user", "123", Role.USER));
        } catch (Exception e) {
            System.out.println("Users already exist or error creating users: " + e.getMessage());
        }

        // --- Create Categories ---
        Map<String, Long> categoryIds = new HashMap<>();

        try {
            // Create 10 categories
            categoryIds.put("Electronics", categoryService.createCategory(
                    new CategoryCreateDTO("Electronics", "Tech gadgets and electronic devices")).id());

            categoryIds.put("Books", categoryService.createCategory(
                    new CategoryCreateDTO("Books", "Books, literature and educational material")).id());

            categoryIds.put("Clothing", categoryService.createCategory(
                    new CategoryCreateDTO("Clothing", "Fashion and apparel for all ages")).id());

            categoryIds.put("Home & Garden", categoryService.createCategory(
                    new CategoryCreateDTO("Home & Garden", "Home improvement and gardening supplies")).id());

            categoryIds.put("Sports", categoryService.createCategory(
                    new CategoryCreateDTO("Sports", "Sports equipment and fitness gear")).id());

            categoryIds.put("Beauty", categoryService.createCategory(
                    new CategoryCreateDTO("Beauty", "Cosmetics and personal care products")).id());

            categoryIds.put("Automotive", categoryService.createCategory(
                    new CategoryCreateDTO("Automotive", "Car parts and automotive accessories")).id());

            categoryIds.put("Food & Beverages", categoryService.createCategory(
                    new CategoryCreateDTO("Food & Beverages", "Gourmet food and specialty drinks")).id());

            categoryIds.put("Toys & Games", categoryService.createCategory(
                    new CategoryCreateDTO("Toys & Games", "Toys, games and entertainment products")).id());

            categoryIds.put("Health", categoryService.createCategory(
                    new CategoryCreateDTO("Health", "Health supplements and medical supplies")).id());

        } catch (Exception e) {
            System.out.println("Categories already exist or error creating: " + e.getMessage());
        }

        // --- Create Products ---
        try {
            // Electronics (4 products)
            if (categoryIds.get("Electronics") != null) {
                productService.createProduct(new ProductCreateDTO("iPhone 15 Pro", new BigDecimal("999.99"), categoryIds.get("Electronics")));
                productService.createProduct(new ProductCreateDTO("MacBook Air M2", new BigDecimal("1199.99"), categoryIds.get("Electronics")));
                productService.createProduct(new ProductCreateDTO("Samsung 4K Smart TV", new BigDecimal("699.99"), categoryIds.get("Electronics")));
                productService.createProduct(new ProductCreateDTO("AirPods Pro", new BigDecimal("249.99"), categoryIds.get("Electronics")));
            }

            // Books (3 products)
            if (categoryIds.get("Books") != null) {
                productService.createProduct(new ProductCreateDTO("The Alchemist", new BigDecimal("15.99"), categoryIds.get("Books")));
                productService.createProduct(new ProductCreateDTO("Clean Code", new BigDecimal("34.99"), categoryIds.get("Books")));
                productService.createProduct(new ProductCreateDTO("Atomic Habits", new BigDecimal("18.99"), categoryIds.get("Books")));
            }

            // Clothing (3 products)
            if (categoryIds.get("Clothing") != null) {
                productService.createProduct(new ProductCreateDTO("Nike Air Max Sneakers", new BigDecimal("129.99"), categoryIds.get("Clothing")));
                productService.createProduct(new ProductCreateDTO("Levi's 501 Jeans", new BigDecimal("79.99"), categoryIds.get("Clothing")));
                productService.createProduct(new ProductCreateDTO("Adidas Hoodie", new BigDecimal("59.99"), categoryIds.get("Clothing")));
            }

            // Home & Garden (2 products)
            if (categoryIds.get("Home & Garden") != null) {
                productService.createProduct(new ProductCreateDTO("Dyson Vacuum Cleaner", new BigDecimal("399.99"), categoryIds.get("Home & Garden")));
                productService.createProduct(new ProductCreateDTO("Garden Tool Set", new BigDecimal("89.99"), categoryIds.get("Home & Garden")));
            }

            // Sports (2 products)
            if (categoryIds.get("Sports") != null) {
                productService.createProduct(new ProductCreateDTO("Yoga Mat Premium", new BigDecimal("49.99"), categoryIds.get("Sports")));
                productService.createProduct(new ProductCreateDTO("Adjustable Dumbbells", new BigDecimal("199.99"), categoryIds.get("Sports")));
            }

            // Beauty (2 products)
            if (categoryIds.get("Beauty") != null) {
                productService.createProduct(new ProductCreateDTO("Moisturizing Face Cream", new BigDecimal("29.99"), categoryIds.get("Beauty")));
                productService.createProduct(new ProductCreateDTO("Hair Styling Kit", new BigDecimal("79.99"), categoryIds.get("Beauty")));
            }

            // Automotive (2 products)
            if (categoryIds.get("Automotive") != null) {
                productService.createProduct(new ProductCreateDTO("Car Phone Mount", new BigDecimal("24.99"), categoryIds.get("Automotive")));
                productService.createProduct(new ProductCreateDTO("Premium Car Wax", new BigDecimal("34.99"), categoryIds.get("Automotive")));
            }

            // Food & Beverages (2 products)
            if (categoryIds.get("Food & Beverages") != null) {
                productService.createProduct(new ProductCreateDTO("Organic Coffee Beans", new BigDecimal("19.99"), categoryIds.get("Food & Beverages")));
                productService.createProduct(new ProductCreateDTO("Gourmet Chocolate Box", new BigDecimal("39.99"), categoryIds.get("Food & Beverages")));
            }

            // Toys & Games (2 products)
            if (categoryIds.get("Toys & Games") != null) {
                productService.createProduct(new ProductCreateDTO("LEGO Architecture Set", new BigDecimal("129.99"), categoryIds.get("Toys & Games")));
                productService.createProduct(new ProductCreateDTO("Board Game Collection", new BigDecimal("59.99"), categoryIds.get("Toys & Games")));
            }

            // Health (2 products)
            if (categoryIds.get("Health") != null) {
                productService.createProduct(new ProductCreateDTO("Vitamin D3 Supplements", new BigDecimal("24.99"), categoryIds.get("Health")));
                productService.createProduct(new ProductCreateDTO("Digital Blood Pressure Monitor", new BigDecimal("79.99"), categoryIds.get("Health")));
            }

        } catch (Exception e) {
            System.out.println("Products already exist or error creating: " + e.getMessage());
        }

        System.out.println(" Sample data initialized successfully with 10 categories and 22 products.");
    }
}