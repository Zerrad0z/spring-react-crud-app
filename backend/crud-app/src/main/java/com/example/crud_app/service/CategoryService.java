package com.example.crud_app.service;

import com.example.crud_app.dto.CategoryCreateDTO;
import com.example.crud_app.dto.CategoryDTO;
import com.example.crud_app.dto.CategoryUpdateDTO;
import com.example.crud_app.dto.CategoryWithProductsDTO;
import com.example.crud_app.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface CategoryService {
    /*
     * Retrieve all categories with pagination
     */
    Page<CategoryDTO> getAllCategories(Pageable pageable);

    Category findCategoryById(long id);

    /*
     * Get single category by ID
     */
    CategoryDTO getCategoryById(Long id);

    /*
     * Get category with all its associated products
     */
    CategoryWithProductsDTO getCategoryWithProducts(Long id);

    /*
     * Create a new category
     */
    @Transactional
    CategoryDTO creaCategory(CategoryCreateDTO createDTO);

    /*
     * Update an existing category
     */
    @Transactional
    CategoryDTO updateCategory(Long id, CategoryUpdateDTO updateDTO);

    /*
     * Delete a category
     */
    @Transactional
    void deleteCategory(Long id);
}
