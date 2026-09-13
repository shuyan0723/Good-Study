import { Controller, Post, Get, Body, HttpCode } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // GET /auth/users —— 调试：查看所有注册用户（生产环境记得加 Guard！）
  @Get('users')
  async listUsers() {
    const users = await this.userRepo.find();
    // 剔除 password
    const safe = users.map(({ password, ...rest }) => rest);
    return { code: 0, data: safe, message: 'success' };
  }

  // POST /auth/register —— 注册
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
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
