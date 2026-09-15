package com.fullstack.demo.products;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品实体 —— 对应 NestJS 的 product.entity.ts
 * 映射数据库表 products
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    // DECIMAL(10,2)，对应 TypeORM 的 decimal + transformer
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ========== Getters & Setters ==========
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
