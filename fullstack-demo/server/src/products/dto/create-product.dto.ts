import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: '商品名必须是字符串' })
  name: string;

  @IsNumber({}, { message: '价格必须是数字' })
  @Min(0, { message: '价格不能为负数' })
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
