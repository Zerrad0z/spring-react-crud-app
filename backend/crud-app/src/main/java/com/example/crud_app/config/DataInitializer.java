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
        Long techCategoryId = null;
        Long bookCategoryId = null;

        try {
            techCategoryId = categoryService.creaCategory(
                    new CategoryCreateDTO("Electronics", "Tech gadgets and devices")
            ).id();

            bookCategoryId = categoryService.creaCategory(
                    new CategoryCreateDTO("Books", "Books and literature")
            ).id();
        } catch (Exception e) {
            System.out.println("Categories already exist or error creating: " + e.getMessage());
        }

        // --- Create Products ---
        try {
            if (techCategoryId != null) {
                productService.createProduct(new ProductCreateDTO("Smartphone", new BigDecimal("499.99"), techCategoryId));
                productService.createProduct(new ProductCreateDTO("Laptop", new BigDecimal("899.99"), techCategoryId));
            }

            if (bookCategoryId != null) {
                productService.createProduct(new ProductCreateDTO("The Alchemist", new BigDecimal("15.99"), bookCategoryId));
                productService.createProduct(new ProductCreateDTO("Clean Code", new BigDecimal("34.99"), bookCategoryId));
            }
        } catch (Exception e) {
            System.out.println("Products already exist or error creating: " + e.getMessage());
        }

        System.out.println(" Sample data initialized successfully.");
    }
}
