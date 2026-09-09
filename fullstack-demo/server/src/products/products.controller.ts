import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity'; // 🔑 从 Entity 导入

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /products —— 获取列表
  @Get()
  async findAll(): Promise<{ code: number; data: Product[]; message: string }> {
    const data = await this.productsService.findAll(); // 🔑 await 数据库查询
    return { code: 0, data, message: 'success' };
  }

  // GET /products/:id —— 获取单个
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ code: number; data: Product; message: string }> {
    const data = await this.productsService.findOne(id);
    return { code: 0, data, message: 'success' };
  }

  // POST /products —— 创建商品
  @Post()
  async create(
    @Body() dto: CreateProductDto,
  ): Promise<{ code: number; data: Product; message: string }> {
    const data = await this.productsService.create(dto);
    return { code: 0, data, message: '创建成功' };
  }
}
