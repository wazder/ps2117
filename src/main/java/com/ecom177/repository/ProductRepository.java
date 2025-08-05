package com.ecom177.repository;

import com.ecom177.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryIds IS NULL OR p.category.id IN :categoryIds)")
    List<Product> searchProducts(@Param("name") String name, @Param("categoryIds") List<Long> categoryIds);
}