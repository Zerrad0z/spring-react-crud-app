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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ConcurrentModificationException;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    /*
     * Retrieve all categories with pagination
     */
    @Override
    public Page<CategoryDTO> getAllCategories(Pageable pageable){
        return categoryRepository.findAll(pageable)
                .map(categoryMapper::toDTO);
    }

    @Override
    public Category findCategoryById(long id){
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ConcurrentModificationException("Category not found with id:" + id));
    }

    /*
     * Get single category by ID
     */
    @Override
    public CategoryDTO getCategoryById(Long id){
        Category category = findCategoryById(id);
        return categoryMapper.toDTO(category);
    }

    /*
     * Get category with all its associated products
     */
    @Override
    public CategoryWithProductsDTO getCategoryWithProducts(Long id){
        Category category = findCategoryById(id);
        return categoryMapper.toDTOWithProducts(category);
    }

    /*
     * Create a new category
     */
    @Transactional
    @Override
    public CategoryDTO creaCategory(CategoryCreateDTO createDTO){
        Category category = categoryMapper.toEntity(createDTO);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(savedCategory);
    }

    /*
     * Update an existing category
     */
    @Transactional
    @Override
    public CategoryDTO updateCategory(Long id, CategoryUpdateDTO updateDTO){
        Category category = findCategoryById(id);
        validateCategoryName(updateDTO.name(), id);
        categoryMapper.updateEntity(category, updateDTO);
        Category saveCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(saveCategory);
    }

    /*
     * Delete a category
     */
    @Transactional
    @Override
    public void deleteCategory(Long id){
        if (!categoryRepository.existsById(id)){
            throw new CategoryNotFoundException("Category not found with id:" + id);
        }
        categoryRepository.deleteById(id);
    }

    /*
     * Validate that category name is unique
     */
    private void validateCategoryName(String name, Long excludeId){
        boolean exists = (excludeId == null)
                ? categoryRepository.existsByName(name)
                : categoryRepository.existsByNameAndIdNot(name, excludeId);
        if (exists) {
            throw new DuplicateCategoryNameException("Category with name'"+ name + "' already exists");
        }
    }
}
