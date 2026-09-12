import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ========== 注册 ==========
  async register(dto: RegisterDto): Promise<User> {
    // 检查用户名是否已存在
    const existUser = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existUser) {
      if (existUser.username === dto.username) {
        throw new ConflictException('用户名已被使用');
      }
      throw new ConflictException('邮箱已被注册');
    }

    // bcrypt 加密密码（salt rounds = 10）
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    return await this.userRepo.save(user);
  }

  // ========== 登录 ==========
  async login(dto: LoginDto): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userRepo.findOne({ where: { username: dto.username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成 JWT
    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    // 返回用户信息时剔除 password
    const { password, ...safeUser } = user;
    return { token, user: safeUser };
  }
}
