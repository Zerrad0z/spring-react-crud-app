package com.example.crud_app.repository;

import com.example.crud_app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.name ILIKE %:name%")
    Page<Product> findByNameContainingIgnoreCase(@Param("name") String name,Pageable pageable);

    // flexible search
    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR p.name ILIKE %:name%) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> searchProducts(
            @Param("name") String name,
            @Param("minPrice")BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    /*
     * Check if product exists by name
     */
    boolean existsByName(String name);

    /*
     * Check if product exists by name excluding a specific id
     */
    boolean existsByNameAndIdNot(String name, Long id);

}
