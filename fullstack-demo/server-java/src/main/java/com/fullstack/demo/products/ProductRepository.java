package com.fullstack.demo.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 商品数据访问层 —— 对应 NestJS 中注入的 Repository<Product>
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
