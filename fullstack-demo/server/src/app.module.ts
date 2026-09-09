import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { BugModule } from './bug/bug.module';

@Module({
  imports: [ProductsModule, BugModule],
})
export class AppModule {}
