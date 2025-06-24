package com.example.crud_app.controller;

import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.dto.ProductDTO;
import com.example.crud_app.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDTO createSampleProduct() {
        return new ProductDTO(
                1L,
                "Test Product",
                BigDecimal.valueOf(19.99),
                1L,
                "Test Category"
        );
    }

    @Test
    void getProductById_ShouldReturnProduct() throws Exception {
        ProductDTO sample = createSampleProduct();
        when(productService.getProductById(1L)).thenReturn(sample);

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void createProduct_ShouldReturnCreatedStatus() throws Exception {
        ProductDTO sample = createSampleProduct();
        when(productService.createProduct(any(ProductCreateDTO.class))).thenReturn(sample);

        String requestBody = objectMapper.writeValueAsString(
                new ProductCreateDTO(
                        "Test Product",
                        BigDecimal.valueOf(19.99),
                        1L
                )
        );

        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void deleteProduct_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/products/1"))
                .andExpect(status().isNoContent());
    }
}