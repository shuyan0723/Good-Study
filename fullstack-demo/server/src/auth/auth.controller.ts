import { Controller, Post, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register —— 注册
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    // 剔除 password 后再返回
    const { password, ...safeUser } = user;
    return { code: 0, data: safeUser, message: '注册成功' };
  }

  // POST /auth/login —— 登录
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { code: 0, data: result, message: '登录成功' };
  }
}
