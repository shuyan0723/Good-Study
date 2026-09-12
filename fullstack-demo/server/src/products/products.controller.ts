import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.interface';

@Controller('products')
export class ProductsController {
  // 依赖注入：NestJS 帮我们 new ProductsService
  constructor(private readonly productsService: ProductsService) {}

  // GET /products —— 获取列表
  @Get()
  findAll(): { code: number; data: Product[]; message: string } {
    const data = this.productsService.findAll();
    return { code: 0, data, message: 'success' }; // 🔑 统一响应格式
  }

  // GET /products/:id —— 获取单个
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): { code: number; data: Product; message: string } {
    // ParseIntPipe 自动把 URL 里的 "1" 转成数字 1
    const data = this.productsService.findOne(id);
    return { code: 0, data, message: 'success' };
  }

  // POST /products —— 创建商品
  @Post()
  create(@Body() dto: CreateProductDto): { code: number; data: Product; message: string } {
    const data = this.productsService.create(dto);
    return { code: 0, data, message: '创建成功' };
  }
}
