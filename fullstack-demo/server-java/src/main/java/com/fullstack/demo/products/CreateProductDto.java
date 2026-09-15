package com.fullstack.demo.products;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * 创建商品 DTO —— 对应 NestJS 的 CreateProductDto
 */
public class CreateProductDto {

    @NotBlank(message = "商品名必须是字符串")
    private String name;

    @NotNull(message = "价格必须是数字")
    @DecimalMin(value = "0", message = "价格不能为负数")
    private BigDecimal price;

    @Size(max = 500)
    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
