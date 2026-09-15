package com.fullstack.demo.products;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * 商品服务 —— 对应 NestJS 的 ProductsService
 */
@Service
public class ProductsService {

    private final ProductRepository productRepository;

    public ProductsService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * 获取所有商品 —— 对应 NestJS findAll()
     */
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    /**
     * 根据 ID 获取单个商品 —— 对应 NestJS findOne()
     */
    public Product findOne(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ID 为 " + id + " 的商品不存在"));
    }

    /**
     * 创建商品 —— 对应 NestJS create()
     */
    public Product create(CreateProductDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "商品名不能为空");
        }
        if (dto.getPrice() == null || dto.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "价格不能为负数");
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        // createdAt 由 @PrePersist 自动填充

        return productRepository.save(product);
    }
}
