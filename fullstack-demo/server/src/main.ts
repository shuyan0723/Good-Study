import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔑 关键：开启 CORS，允许前端跨域请求
  // 如果不配置，前端 fetch 会报 CORS 错误 —— 这是联调最常见的坑
  app.enableCors({
    origin: 'http://localhost:5173', // 允许的前端地址（Vite 默认端口）
    credentials: true,
  });

  // 开启全局 DTO 参数校验
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 自动剔除 DTO 中未定义的字段
    transform: true, // 自动类型转换（比如字符串 "123" → 数字 123）
  }));

  const port = 3000;
  await app.listen(port);
  Logger.log(`🚀 Nest.js 后端已启动: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
