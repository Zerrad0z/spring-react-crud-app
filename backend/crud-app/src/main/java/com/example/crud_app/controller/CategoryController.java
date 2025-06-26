package com.example.crud_app.controller;

import com.example.crud_app.dto.*;
import com.example.crud_app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /*
     * Get all categories
     */
    @GetMapping
    public Page<CategoryDTO> getAllCategories(@PageableDefault(size = 10) Pageable pageable){
      return categoryService.getAllCategories(pageable);
    }

    /*
     * Get single category by ID
     */
    @GetMapping("/{id}")
    public CategoryDTO getCategoryById(@PathVariable Long id){
        return categoryService.getCategoryById(id);
    }

    /*
     * Get category with all its products
     */
    @GetMapping("/{id}/products")
    public CategoryWithProductsDTO getCategoryWithProducts(@PathVariable Long id){
        return categoryService.getCategoryWithProducts(id);
    }

    /*
     * Create a new category
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDTO createCategory(@RequestBody CategoryCreateDTO createDTO){
        return categoryService.creaCategory(createDTO);
    }

    /*
     * Update an existing category
     * PUT /api/v1/categories/1
     */
    @PutMapping("/{id}")
    public CategoryDTO updateCategory(@PathVariable Long id,
                                      @RequestBody CategoryUpdateDTO updateDTO){
        return categoryService.updateCategory(id, updateDTO);
    }

    /*
     * Detele a category
     * DELETE /api/v1/categories/1
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
    }

    /*
     * Search a category
     */
    @GetMapping("/search")
    public Page<CategoryDTO> searchCategories(
            @RequestParam(required = false) String name,
            Pageable pageable){
        return categoryService.searchProduct(name,pageable);
    }
}
