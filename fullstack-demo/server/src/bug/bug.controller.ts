import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('bug')
export class BugController {

  // 场景 1: 模拟慢接口（3秒后才返回）
  // ⚠️ 前端如果设了 timeout < 3s，就会报超时错误
  @Get('/timeout')
  async slowApi(): Promise<{ code: number; data: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { code: 0, data: '终于返回了...', message: 'success' };
  }

  // 场景 2: 故意 crash（未捕获异常）
  // ⚠️ 会返回 500 Internal Server Error
  @Get('/crash')
  crashApi(): never {
    throw new Error('💥 后端崩了！这是故意制造的错误');
  }

  // 场景 3: 返回数据格式和前端期望不一致
  // 前端期望 { code: 0, data, message }，这里没按格式来
  @Get('/format')
  wrongFormat(): { success: boolean; items: any[] } {
    return { success: true, items: [1, 2, 3] }; // 缺少 code 和 message
  }

  // 场景 4: 演示状态码 401（未授权）
  // 前端没带 token 访问，后端返回 401
  @Get('/unauthorized')
  noAuth(@Req() req: Request): { code: number; data: any; message: string } {
    const token = req.headers['authorization'];
    if (!token) {
      return { code: 401, data: null, message: '未授权访问，请先登录' };
    }
    return { code: 0, data: { user: '张三' }, message: 'success' };
  }
}
