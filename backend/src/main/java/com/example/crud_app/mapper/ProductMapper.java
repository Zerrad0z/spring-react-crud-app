package com.example.crud_app.mapper;

import com.example.crud_app.dto.ProductCreateDTO;
import com.example.crud_app.dto.ProductDTO;
import com.example.crud_app.dto.ProductUpdateDTO;
import com.example.crud_app.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductDTO toDTO(Product product);

    List<ProductDTO> toDTOList(List<Product> products);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductCreateDTO createDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    void updateEntity(@MappingTarget Product product, ProductUpdateDTO updateDTO);
}
