package com.example.crud_app.service;

import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.dto.ProductDTO;
import com.example.crud_app.dto.ProductUpdateDTO;
import com.example.crud_app.entity.Category;
import com.example.crud_app.entity.Product;
import com.example.crud_app.exception.CategoryNotFoundException;
import com.example.crud_app.exception.ProductNotFoundException;
import com.example.crud_app.mapper.ProductMapper;
import com.example.crud_app.repository.CategoryRepository;
import com.example.crud_app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    /*
     * Retrieve all products with pagination
     */
    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable){
        return productRepository.findAll(pageable)
                .map(productMapper::toDTO);
    }

    /*
     * Get all products in a specific category
     */
    @Override
    public Page<ProductDTO> getProductByCategory(Long categoryId, Pageable pageable){
        return productRepository.findByCategoryId(categoryId, pageable)
                .map(productMapper::toDTO);
    }

    @Override
    public Product findProductById(Long id){
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    /*
     * Get single product by ID
     */
    @Override
    public ProductDTO getProductById(Long id){
        Product product = findProductById(id);
        return productMapper.toDTO(product);
    }

    private Category findCategoryById(Long id){
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id:" + id));
    }

    /*
     * Create a new product
     */
    @Transactional
    @Override
    public ProductDTO createProduct(ProductCreateDTO createDTO){
        Category category = findCategoryById(createDTO.categoryId());
        Product product = productMapper.toEntity(createDTO);
        product.setCategory(category);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    /*
     * Update an existing product
     */
    @Transactional
    @Override
    public ProductDTO updateProduct(Long id, ProductUpdateDTO updateDTO){
        Product product = findProductById(id);
        Category category = findCategoryById(updateDTO.categoryId());
        productMapper.updateEntity(product, updateDTO);
        product.setCategory(category);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    /*
     * Delete a product
     */
    @Transactional
    @Override
    public void deleteProduct(Long id){
        if(!productRepository.existsById(id)){
            throw new ProductNotFoundException("Product not found with id:" + id);
        }
        productRepository.deleteById(id);
    }

    /*
     * Flexible search
     */
    @Override
    public Page<ProductDTO> searchProduct(String name, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable){
        return productRepository.searchProducts(name,minPrice,maxPrice,pageable).map(productMapper::toDTO);
    }
}
