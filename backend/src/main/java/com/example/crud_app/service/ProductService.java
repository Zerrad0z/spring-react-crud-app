package com.example.crud_app.service;

import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.dto.ProductDTO;
import com.example.crud_app.dto.ProductUpdateDTO;
import com.example.crud_app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

public interface ProductService {


    /*
     * Retrieve all products with pagination
     */
    Page<ProductDTO> getAllProducts(Pageable pageable);

    /*
     * Get all products in a specific category
     */
    Page<ProductDTO> getProductByCategory(Long categoryId, Pageable pageable);

    Product findProductById(Long id);

    /*
     * Get single product by ID
     */
    ProductDTO getProductById(Long id);

    /*
     * Create a new product
     */
    @Transactional
    ProductDTO createProduct(ProductCreateDTO createDTO);

    /*
     * Update an existing product
     */
    @Transactional
    ProductDTO updateProduct(Long id, ProductUpdateDTO updateDTO);

    /*
     * Delete a product
     */
    @Transactional
    void deleteProduct(Long id);

    /*
     * Flexible search
     */
    Page<ProductDTO> searchProduct(String name, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
