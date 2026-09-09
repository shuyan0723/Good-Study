import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity'; // 🔑 从 Entity 导入（不是 interface 了）
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  // 🔑 关键变化：不再用 private products 内存数组
  // 而是注入 TypeORM 的 Repository，所有操作都走数据库
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // 获取所有商品 —— SELECT * FROM products
  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  // 根据 ID 获取单个商品 —— SELECT * FROM products WHERE id = ?
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`ID 为 ${id} 的商品不存在`);
    }
    return product;
  }

  // 创建商品 —— INSERT INTO products (...) VALUES (...)
  async create(dto: CreateProductDto): Promise<Product> {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('商品名不能为空');
    }
    if (dto.price === undefined || dto.price < 0) {
      throw new BadRequestException('价格不能为负数');
    }

    const newProduct = this.productRepo.create({
      name: dto.name,
      price: dto.price,
      description: dto.description,
      // createdAt 由 @CreateDateColumn 自动填充，不用手动写
    });

    return this.productRepo.save(newProduct);
  }
}
