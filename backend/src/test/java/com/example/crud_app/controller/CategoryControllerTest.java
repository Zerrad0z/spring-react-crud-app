//package com.example.crud_app.controller;
//
//import com.example.crud_app.dto.CategoryCreateDTO;
//import com.example.crud_app.dto.CategoryDTO;
//import com.example.crud_app.service.CategoryService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(CategoryController.class)
//class CategoryControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private CategoryService categoryService;
//
//    private CategoryDTO createSampleCategory() {
//        return new CategoryDTO(1L, "Electronics", "Electronic devices");
//    }
//
//    @Test
//    void getAllCategories_ShouldReturnPage() throws Exception {
//        Page<CategoryDTO> page = new PageImpl<>(List.of(createSampleCategory()));
//        Mockito.when(categoryService.getAllCategories(any())).thenReturn(page);
//
//        mockMvc.perform(get("/api/v1/categories"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.content[0].name").value("Electronics"));
//    }
//
//    @Test
//    void getCategoryById_ShouldReturnCategory() throws Exception {
//        Mockito.when(categoryService.getCategoryById(1L)).thenReturn(createSampleCategory());
//
//        mockMvc.perform(get("/api/v1/categories/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Electronics"));
//    }
//
//    @Test
//    void createCategory_ShouldReturnCreated() throws Exception {
//        CategoryDTO sample = createSampleCategory();
//        Mockito.when(categoryService.creaCategory(any())).thenReturn(sample);
//
//        mockMvc.perform(post("/api/v1/categories")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(
//                                new CategoryCreateDTO("Electronics", "Electronic devices"))))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").exists());
//    }
//
//    @Test
//    void deleteCategory_ShouldReturnNoContent() throws Exception {
//        mockMvc.perform(delete("/api/v1/categories/1"))
//                .andExpect(status().isNoContent());
//    }
//}