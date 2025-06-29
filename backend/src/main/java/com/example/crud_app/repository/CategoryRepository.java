package com.example.crud_app.repository;

import com.example.crud_app.entity.Category;
import com.example.crud_app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    /*
     * Check if category exists by name
     */
    boolean existsByName(String name);

    /*
     * Check if category exists by name excluding a specific id
     */
    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT c FROM Category c WHERE c.name ILIKE %:name%")
    Page<Category> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    // flexible search
    @Query("SELECT c FROM Category c WHERE " +
            "(:name IS NULL OR c.name ILIKE %:name%) ")
    Page<Category> searchCategory(
            @Param("name") String category,
                        Pageable pageable);

}
