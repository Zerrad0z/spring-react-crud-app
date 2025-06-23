package com.example.crud_app.mapper;

import com.example.crud_app.dto.CategoryCreateDTO;
import com.example.crud_app.dto.CategoryDTO;
import com.example.crud_app.dto.CategoryUpdateDTO;
import com.example.crud_app.dto.CategoryWithProductsDTO;
import com.example.crud_app.entity.Category;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

public interface CategoryMapper {

    CategoryDTO toDTO(Category category);
    List<CategoryDTO> toDTOList(List<Category> categories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "products", ignore = true)
    Category toEntity(CategoryCreateDTO createDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "products", ignore = true)
    void updateEntity(@MappingTarget Category category, CategoryUpdateDTO updateDTO);

    @Mapping(target = "products", source = "products")
    CategoryWithProductsDTO toDTOWithProducts(Category category);
}
