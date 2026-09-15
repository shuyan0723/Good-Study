package com.fullstack.demo.products;

import com.fullstack.demo.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品控制器 —— 对应 NestJS 的 ProductsController
 * 路由前缀: /products
 */
@RestController
@RequestMapping("/products")
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    /**
     * GET /products —— 获取商品列表
     */
    @GetMapping
    public ApiResponse<List<Product>> findAll() {
        List<Product> data = productsService.findAll();
        return ApiResponse.success(data);
    }

    /**
     * GET /products/{id} —— 获取单个商品
     */
    @GetMapping("/{id}")
    public ApiResponse<Product> findOne(@PathVariable Long id) {
        Product data = productsService.findOne(id);
        return ApiResponse.success(data);
    }

    /**
     * POST /products —— 创建商品
     */
    @PostMapping
    public ApiResponse<Product> create(@Valid @RequestBody CreateProductDto dto) {
        Product data = productsService.create(dto);
        return ApiResponse.success(data, "创建成功");
    }
}
