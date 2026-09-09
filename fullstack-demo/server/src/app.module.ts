import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ProductsModule } from './products/products.module';
import { BugModule } from './bug/bug.module';

// 加载 .env 配置
config();

@Module({
  imports: [
    // 🔑 接入 TypeORM：数据库连接配置
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fullstack_demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动扫描所有 Entity
      synchronize: false, // 生产环境关闭，避免自动改表结构；开发环境可开 true
      charset: 'utf8mb4',
    }),
    ProductsModule,
    BugModule,
  ],
})
export class AppModule {}
