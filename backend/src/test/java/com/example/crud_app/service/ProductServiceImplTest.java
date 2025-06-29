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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;
    private ProductDTO testProductDTO;
    private Category testCategory;
    private ProductCreateDTO testCreateDTO;
    private ProductUpdateDTO testUpdateDTO;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Electronics")
                .build();

        testProduct = Product.builder()
                .id(1L)
                .name("Laptop")
                .price(new BigDecimal("999.99"))
                .category(testCategory)
                .build();

        testProductDTO = new ProductDTO(1L, "Laptop", new BigDecimal("999.99"),
                 1L, "Electronics");
        testCreateDTO = new ProductCreateDTO("New Laptop", new BigDecimal("1299.99"),
                1L);
        testUpdateDTO = new ProductUpdateDTO("Updated Laptop", new BigDecimal("1199.99"),
                 1L);
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getAllProducts_ShouldReturnPageOfProductDTOs() {
        Page<Product> productPage = new PageImpl<>(List.of(testProduct), pageable, 1);
        when(productRepository.findAll(pageable)).thenReturn(productPage);
        when(productMapper.toDTO(testProduct)).thenReturn(testProductDTO);

        Page<ProductDTO> result = productService.getAllProducts(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0)).isEqualTo(testProductDTO);
    }

    @Test
    void getProductById_WhenExists_ShouldReturnProductDTO() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productMapper.toDTO(testProduct)).thenReturn(testProductDTO);

        ProductDTO result = productService.getProductById(1L);

        assertThat(result).isEqualTo(testProductDTO);
    }

    @Test
    void getProductById_WhenNotExists_ShouldThrowException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(999L))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining("Product not found with id: 999");
    }

    @Test
    void createProduct_WithValidData_ShouldReturnProductDTO() {
        Product newProduct = Product.builder().name("New Laptop").build();
        Product savedProduct = Product.builder().id(2L).name("New Laptop").category(testCategory).build();
        ProductDTO expectedDTO = new ProductDTO(2L, "New Laptop", new BigDecimal("1299.99"),
                 1L, "Electronics");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productMapper.toEntity(testCreateDTO)).thenReturn(newProduct);
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        when(productMapper.toDTO(savedProduct)).thenReturn(expectedDTO);

        ProductDTO result = productService.createProduct(testCreateDTO);

        assertThat(result).isEqualTo(expectedDTO);
    }

    @Test
    void createProduct_WhenCategoryNotExists_ShouldThrowException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.createProduct(testCreateDTO))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category not found with id:1");
    }

    @Test
    void updateProduct_WithValidData_ShouldReturnUpdatedDTO() {
        Product updatedProduct = Product.builder().id(1L).name("Updated Laptop").build();
        ProductDTO expectedDTO = new ProductDTO(1L, "Updated Laptop", new BigDecimal("1199.99"),
                 1L, "Electronics");

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        when(productMapper.toDTO(updatedProduct)).thenReturn(expectedDTO);

        ProductDTO result = productService.updateProduct(1L, testUpdateDTO);

        assertThat(result).isEqualTo(expectedDTO);
        verify(productMapper).updateEntity(testProduct, testUpdateDTO);
    }

    @Test
    void updateProduct_WhenProductNotExists_ShouldThrowException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct(1L, testUpdateDTO))
                .isInstanceOf(ProductNotFoundException.class);
    }

    @Test
    void deleteProduct_WhenExists_ShouldDeleteSuccessfully() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.deleteProduct(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteProduct_WhenNotExists_ShouldThrowException() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> productService.deleteProduct(999L))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining("Product not found with id:999");
    }
}