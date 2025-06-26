package com.example.crud_app.controller;

import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.dto.ProductDTO;
import com.example.crud_app.dto.ProductUpdateDTO;
import com.example.crud_app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductDTO> getAllProducts(Pageable pageable){
        return productService.getAllProducts(pageable);
    }

    /*
     * Get all products in a specific category
     */
    @GetMapping("/category/{categoryId}")
    public Page<ProductDTO> getProductsByCategory(@PathVariable Long categoryId,
                                                  @PageableDefault(size = 10) Pageable pageable){
        return productService.getProductByCategory(categoryId, pageable);
    }

    /*
     * Get single product by ID
     */
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    /*
     * Create a new product
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDTO createProduct(@RequestBody ProductCreateDTO createDTO){
        return productService.createProduct(createDTO);
    }

    /*
     * Update an existing product
     * PUT /api/v1/products/1
     */
    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,
                                    @RequestBody ProductUpdateDTO updateDTO){
        return productService.updateProduct(id, updateDTO);
    }

    /*
     * Delete a product
     * DELETE /api/v1/products/1
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }

    /*
     * Search a product
     */
    @GetMapping("/search")
    public Page<ProductDTO> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable){
        return productService.searchProduct(name,minPrice,maxPrice,pageable);
    }

}
