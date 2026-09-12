import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './product.interface';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  // 用内存数组模拟数据库（注意：服务重启数据会丢失）
  private products: Product[] = [
    { id: 1, name: 'iPhone 15 Pro', price: 7999, description: '最新款苹果手机', createdAt: '2026-09-01' },
    { id: 2, name: 'MacBook Air', price: 8999, description: '轻薄笔记本', createdAt: '2026-09-02' },
    { id: 3, name: 'AirPods Pro', price: 1899, description: '降噪耳机', createdAt: '2026-09-03' },
  ];
  private nextId = 4;

  // 获取所有商品
  findAll(): Product[] {
    return this.products;
  }

  // 根据 ID 获取单个商品
  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      // 🔑 抛出 NestJS 内置异常，会自动返回 404 状态码
      throw new NotFoundException(`ID 为 ${id} 的商品不存在`);
    }
    return product;
  }

  // 创建商品
  create(dto: CreateProductDto): Product {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('商品名不能为空');
    }
    if (dto.price === undefined || dto.price < 0) {
      throw new BadRequestException('价格不能为负数');
    }

    const newProduct: Product = {
      id: this.nextId++,
      name: dto.name,
      price: dto.price,
      description: dto.description,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
