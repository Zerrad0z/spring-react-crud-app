package com.example.crud_app.service;

import com.example.crud_app.dto.CategoryCreateDTO;
import com.example.crud_app.dto.CategoryDTO;
import com.example.crud_app.dto.CategoryUpdateDTO;
import com.example.crud_app.dto.CategoryWithProductsDTO;
import com.example.crud_app.entity.Category;
import com.example.crud_app.exception.CategoryNotFoundException;
import com.example.crud_app.exception.DuplicateCategoryNameException;
import com.example.crud_app.mapper.CategoryMapper;
import com.example.crud_app.repository.CategoryRepository;
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

import java.util.ConcurrentModificationException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category testCategory;
    private CategoryDTO testCategoryDTO;
    private CategoryCreateDTO testCreateDTO;
    private CategoryUpdateDTO testUpdateDTO;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Electronic devices and gadgets")
                .build();

        testCategoryDTO = new CategoryDTO(1L, "Electronics", "Electronic devices and gadgets");
        testCreateDTO = new CategoryCreateDTO("New Category", "New category description");
        testUpdateDTO = new CategoryUpdateDTO("Updated Electronics", "Updated description");
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getAllCategories_ShouldReturnPageOfCategoryDTOs() {
        // Given
        Page<Category> categoryPage = new PageImpl<>(List.of(testCategory), pageable, 1);
        when(categoryRepository.findAll(pageable)).thenReturn(categoryPage);
        when(categoryMapper.toDTO(testCategory)).thenReturn(testCategoryDTO);

        // When
        Page<CategoryDTO> result = categoryService.getAllCategories(pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0)).isEqualTo(testCategoryDTO);
    }

    @Test
    void getCategoryById_WhenExists_ShouldReturnCategoryDTO() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryMapper.toDTO(testCategory)).thenReturn(testCategoryDTO);

        // When
        CategoryDTO result = categoryService.getCategoryById(1L);

        // Then
        assertThat(result).isEqualTo(testCategoryDTO);
    }

    @Test
    void getCategoryById_WhenNotExists_ShouldThrowException() {
        // Given
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> categoryService.getCategoryById(999L))
                .isInstanceOf(ConcurrentModificationException.class);
    }

    @Test
    void getCategoryWithProducts_ShouldReturnCategoryWithProductsDTO() {
        // Given
        CategoryWithProductsDTO expected = new CategoryWithProductsDTO(1L, "Electronics", "Description", List.of());
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryMapper.toDTOWithProducts(testCategory)).thenReturn(expected);

        // When
        CategoryWithProductsDTO result = categoryService.getCategoryWithProducts(1L);

        // Then
        assertThat(result).isEqualTo(expected);
    }

    @Test
    void createCategory_ShouldCreateAndReturnCategoryDTO() {
        // Given
        Category newCategory = Category.builder().name("New Category").description("Description").build();
        Category savedCategory = Category.builder().id(2L).name("New Category").description("Description").build();
        CategoryDTO expectedDTO = new CategoryDTO(2L, "New Category", "Description");

        when(categoryMapper.toEntity(testCreateDTO)).thenReturn(newCategory);
        when(categoryRepository.save(newCategory)).thenReturn(savedCategory);
        when(categoryMapper.toDTO(savedCategory)).thenReturn(expectedDTO);

        // When
        CategoryDTO result = categoryService.creaCategory(testCreateDTO);

        // Then
        assertThat(result).isEqualTo(expectedDTO);
    }

    @Test
    void updateCategory_WhenValid_ShouldUpdateAndReturn() {
        // Given
        CategoryDTO expectedDTO = new CategoryDTO(1L, "Updated Electronics", "Updated description");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.existsByNameAndIdNot(testUpdateDTO.name(), 1L)).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(categoryMapper.toDTO(any(Category.class))).thenReturn(expectedDTO);

        // When
        CategoryDTO result = categoryService.updateCategory(1L, testUpdateDTO);

        // Then
        assertThat(result).isEqualTo(expectedDTO);
        verify(categoryMapper).updateEntity(testCategory, testUpdateDTO);
    }

    @Test
    void updateCategory_WhenDuplicateName_ShouldThrowException() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.existsByNameAndIdNot(testUpdateDTO.name(), 1L)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> categoryService.updateCategory(1L, testUpdateDTO))
                .isInstanceOf(DuplicateCategoryNameException.class);
    }

    @Test
    void deleteCategory_WhenExists_ShouldDelete() {
        // Given
        when(categoryRepository.existsById(1L)).thenReturn(true);

        // When
        categoryService.deleteCategory(1L);

        // Then
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void deleteCategory_WhenNotExists_ShouldThrowException() {
        // Given
        when(categoryRepository.existsById(999L)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> categoryService.deleteCategory(999L))
                .isInstanceOf(CategoryNotFoundException.class);
    }
}