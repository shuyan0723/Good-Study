# 从 NestJS 到 Spring Boot：一次完整的 Node.js → Java 后端迁移实战

> 本文将带你把一个已运行的 **NestJS + TypeORM + MySQL** 后端项目，完整迁移到 **Spring Boot 3 + Spring Data JPA + MySQL**。不是玩具 Demo，是真实 API 验证通过的可运行项目，附源码对照、踩坑记录和一张速查映射表。

---

## 0. 为什么要迁移？

先亮明态度：**没有对错，只有取舍**。

| 维度 | NestJS (TypeScript) | Spring Boot (Java) |
|---|---|---|
| 学习曲线 | 低（前端转 Node 友好） | 中（Java 生态厚重） |
| 运行性能 | 单线程 Event Loop | 多线程 JVM，吞吐更高 |
| 类型安全 | 编译时 TS 类型 + class-validator | 编译时 + 运行时字节码校验 |
| 企业级生态 | 快速成长中，但不如 Spring 成熟 | 20 年积累，稳如老狗 |
| 部署体积 | node_modules 动辄几百 MB | fat jar 几十 MB，自带 GC |
| 适合场景 | 快速原型、全栈同构、小中型服务 | 金融/政企/大型分布式系统 |

本文的迁移背景是一个**教学用全栈 Demo**：登录注册 + 商品 CRUD + Bug 演示模块。原 NestJS 后端已经跑在生产 MySQL 上，我们要让 Java 版本零改动对接原前端。

---

## 1. 最终目录结构对照

迁移前 vs 迁移后，整体模块划分几乎一致 —— 这正是 **NestJS 和 Spring Boot 架构理念同源**的体现。

```
NestJS (server/)                          Spring Boot (server-java/)
├── src/                                  ├── src/main/java/com/fullstack/demo/
│   ├── main.ts            ← 启动入口      │   ├── FullstackDemoApplication.java
│   ├── app.module.ts      ← 根模块        │   │   (注解自动扫描，不需要 AppModule)
│   ├── auth/              ← 认证模块      │   ├── auth/
│   │   ├── auth.controller.ts            │   │   ├── AuthController.java
│   │   ├── auth.service.ts               │   │   ├── AuthService.java
│   │   ├── auth.module.ts                │   │   ├── User.java          ← JPA Entity
│   │   ├── user.entity.ts                │   │   ├── UserRepository.java  ← 替代 Repository<User>
│   │   └── dto/                          │   │   ├── RegisterDto.java (jakarta.validation)
│   ├── products/          ← 商品模块      │   │   ├── LoginDto.java
│   │   ├── products.controller.ts        │   │   └── JwtUtil.java        ← 替代 @nestjs/jwt
│   │   ├── products.service.ts           │   ├── products/
│   │   ├── product.entity.ts             │   │   ├── Product.java
│   │   └── dto/                          │   │   ├── ProductsController.java
│   └── bug/               ← Bug演示      │   │   └── ProductsService.java
│       └── bug.controller.ts              │   ├── bug/
├── package.json                          │   │   └── BugController.java
├── tsconfig.json                         │   └── common/                ← 新增：通用模块
│                                         │       ├── ApiResponse.java
│                                         │       ├── GlobalExceptionHandler.java
│                                         │       └── SecurityConfig.java
│                                         ├── pom.xml
│                                         ├── mvnw / mvnw.cmd         ← Maven Wrapper
│                                         └── src/main/resources/application.yml
```

**核心观察：**
- NestJS 的 `*.module.ts`（模块装饰器）**消失了** —— Spring Boot 用 `@SpringBootApplication` + 包扫描自动装配
- 新增了 `common/` 包放横切关注点（统一响应、全局异常、安全配置），这在 NestJS 里通常由 Guard/Interceptor/Filter 实现
- `package.json` → `pom.xml`，`.env` → `application.yml`

---

## 2. 实体映射：TypeORM Decorator vs JPA Annotation

这是迁移中最直接的一步 —— TypeORM 装饰器和 JPA 注解**几乎一一对应**，但有几个细节差异值得注意。

### NestJS 原版

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
```

### Java 版本

```java
// User.java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ← 对应 @PrimaryGeneratedColumn
    private Long id;                                     // ← 用 Long（NestJS 用 number）

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;                     // ← 用 LocalDateTime（NestJS 用 Date）

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist                                          // ← 对应 @CreateDateColumn
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate                                           // ← 对应 @UpdateDateColumn
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ... getters & setters
}
```

### 关键差异点

| 项目 | NestJS / TypeORM | Spring Boot / JPA |
|---|---|---|
| 主键自增 | `@PrimaryGeneratedColumn()` | `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| 时间类型 | `Date` | `LocalDateTime`（推荐，无 timezone 坑） |
| 自动填充时间 | `@CreateDateColumn` / `@UpdateDateColumn` | `@PrePersist` / `@PreUpdate` 生命周期回调 |
| 数值精度 | `@Column({ type: 'decimal', precision: 10, scale: 2 })` + transformer | `@Column(precision = 10, scale = 2)` + `BigDecimal` |
| 类型包装 | `number` | `Long` / `Integer`（对象类型，null 安全） |

> **踩坑记录 #1：** Product 实体中 TypeORM 用了 `transformer: { to: (v) => v, from: (v) => Number(v) }` 来处理 MySQL DECIMAL 返回字符串的问题。Java 侧 **不需要 transformer**，直接用 `BigDecimal`，JDBC 驱动原生处理类型转换。

---

## 3. DTO 校验：class-validator vs jakarta.validation

NestJS 靠 `class-validator` 装饰器 + 全局 `ValidationPipe` 实现参数校验；Spring Boot 用 `jakarta.validation` 注解 + `@Valid` 触发校验。**注解写法几乎一样，但触发机制不同。**

### NestJS 原版

```typescript
// register.dto.ts
import { IsString, MinLength, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: '用户名至少 3 位' })
  username: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  password: string;
}
```

```typescript
// main.ts 全局开启 ValidationPipe
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,   // 剔除 DTO 未定义字段
  transform: true,   // 自动类型转换
}));
```

### Java 版本

```java
// RegisterDto.java
public class RegisterDto {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, message = "用户名至少 3 位")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少 6 位")
    private String password;

    // ... getters & setters
}
```

```java
// AuthController.java —— 在方法参数上加 @Valid
@PostMapping("/register")
public ApiResponse<AuthService.SafeUser> register(
        @Valid @RequestBody RegisterDto dto) {   // ← @Valid 触发校验
    // ...
}
```

### 关键差异点

| 项目 | NestJS | Spring Boot |
|---|---|---|
| 必填校验 | `@IsString()` + 空值检查 | `@NotBlank` / `@NotNull`（JSR-380） |
| 最小长度 | `@MinLength(n)` | `@Size(min = n)` |
| 数字最小值 | `@Min(n)` | `@Min(n)`（注解同名） |
| 可选字段 | `@IsOptional()` | 直接不加注解即可（null 默认跳过校验） |
| 校验触发 | 全局 `ValidationPipe` 自动对所有 Body 生效 | 必须在 Controller 方法参数上加 `@Valid` |

> **踩坑记录 #2：** 别忘记在 Controller 的 `@RequestBody` 参数前加 `@Valid`！不加的话 Spring Boot 完全不会执行任何校验，所有脏数据会直接进 Service 层。

---

## 4. 认证链路：bcrypt + JWT 全对照

这是迁移中**最有技术含量**的部分 —— 密码加密 + Token 生成 + 登录验证。我们用的是业界标准方案，但两侧的依赖和实现方式不同。

### NestJS 原版 AuthService

```typescript
// auth.service.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('用户名或密码错误');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('用户名或密码错误');

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    const { password, ...safeUser } = user;
    return { token, user: safeUser };
  }
}
```

### Java 版本 AuthService

```java
// AuthService.java
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // ← Spring Security BCrypt
    private final JwtUtil jwtUtil;                   // ← 我们自己封装的 jjwt

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResult login(LoginDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        SafeUser safeUser = toSafeUser(user);  // ← 手动剔除 password
        return new LoginResult(token, safeUser);
    }
}
```

### 依赖对照

| 功能 | NestJS npm 包 | Spring Boot Maven 依赖 |
|---|---|---|
| 密码加密 | `bcrypt` | `spring-boot-starter-security`（内置 BCryptPasswordEncoder） |
| JWT 生成/解析 | `@nestjs/jwt`（封装了 jsonwebtoken） | `io.jsonwebtoken:jjwt-api` + `jjwt-impl` + `jjwt-jackson` |
| 数据库访问 | `@nestjs/typeorm` + `typeorm` | `spring-boot-starter-data-jpa` |
| 异常抛出 | `UnauthorizedException` | `ResponseStatusException(HttpStatus.UNAUTHORIZED)` |

### BCrypt 配置一致性

两边都用 **salt rounds = 10**，这一点很重要 —— 如果 rounds 不一致，同密码加密结果不同，用户就登录不上了。

```typescript
// NestJS —— auth.service.ts
const hashedPassword = await bcrypt.hash(dto.password, 10);
```

```java
// Spring Boot —— SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);  // ← 同样的 10
}
```

### JwtUtil 实现（自研替代 @nestjs/jwt）

`@nestjs/jwt` 是 NestJS 生态的封装，Spring Boot 没有直接对应物。我们用 `jjwt` 自己写一个 40 行的工具类：

```java
// JwtUtil.java —— 完整实现
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expiration) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
            keyBytes = padded;
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = expiration;
    }

    public String generateToken(Long userId, String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiration))
                .signWith(secretKey)
                .compact();
    }
}
```

> **踩坑记录 #3：** jjwt 0.12.x 要求 HMAC 密钥至少 **32 字节**。NestJS 的 JWT_SECRET 经常写个短字符串（比如 `'dev-secret'`），直接拿过来会导致 `WeakKeyException`。解决办法是像上面那样 padding 到 32 字节，或者换个够长的 secret。

---

## 5. 统一响应与异常处理架构

NestJS 有一套非常优雅的架构来处理「所有接口返回统一的 `{ code, data, message }` 格式」和「所有异常转成统一格式」，Spring Boot 也能做到，但方式不同。

### 5.1 统一响应体

**NestJS** 用 `Interceptor` 在响应离开 Controller 之前做一层包装：

```typescript
// 伪代码 —— NestJS 统一响应
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context, next) {
    return next.handle().pipe(
      map(data => ({ code: 0, data, message: 'success' })),
    );
  }
}
```

**Spring Boot** 更简单 —— 直接让 Controller 返回 `ApiResponse<T>` 泛型类即可：

```java
// ApiResponse.java —— 一个泛型 POJO
public class ApiResponse<T> {
    private int code;
    private T data;
    private String message;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, data, "success");
    }
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(0, data, message);
    }
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, null, message);
    }
}
```

用静态工厂方法 + 泛型，Controller 代码变得极其干净：

```java
@GetMapping("/products")
public ApiResponse<List<Product>> findAll() {
    return ApiResponse.success(productsService.findAll());
}
```

### 5.2 全局异常处理

**NestJS** 用 `ExceptionFilter`：

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host) {
    const response = host.switchToHttp().getResponse();
    response.status(status).json({
      code: exception.status || 500,
      data: null,
      message: exception.message,
    });
  }
}
```

**Spring Boot** 用 `@ControllerAdvice` —— 类名本身就在说"我是全 Controller 的 Advice"：

```java
// GlobalExceptionHandler.java —— 一个类覆盖所有场景
@ControllerAdvice
public class GlobalExceptionHandler {

    // 业务异常：409/404/400
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        return ResponseEntity.status(status)
                .body(new ApiResponse<>(status.value(), null, ex.getReason()));
    }

    // 参数校验异常：400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ApiResponse<>(400, null, msg));
    }

    // 兜底：500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAll(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(500, null, "服务器内部错误: " + ex.getMessage()));
    }
}
```

### 异常抛出对照

NestJS 提供了一整套语义化异常类，Spring Boot 没有对应物，我们用 `ResponseStatusException` 作为统一替代：

| NestJS 异常 | HTTP 状态码 | Spring Boot 等价写法 |
|---|---|---|
| `ConflictException` | 409 | `new ResponseStatusException(HttpStatus.CONFLICT, "xxx")` |
| `UnauthorizedException` | 401 | `new ResponseStatusException(HttpStatus.UNAUTHORIZED, "xxx")` |
| `NotFoundException` | 404 | `new ResponseStatusException(HttpStatus.NOT_FOUND, "xxx")` |
| `BadRequestException` | 400 | `new ResponseStatusException(HttpStatus.BAD_REQUEST, "xxx")` |

---

## 6. CORS 配置与安全

### NestJS 原版

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

### Spring Boot 版本

```java
// SecurityConfig.java —— 放在 @Configuration 类中
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())                    // 无状态 JWT 不需要 CSRF
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());  // 所有接口放行
    return http.build();
}
```

> **为什么 Spring Security 默认就加进来了？** 因为我们要用 `BCryptPasswordEncoder`。一旦引入了 `spring-boot-starter-security`，Spring Boot 就会自动开启一整套安全过滤链，必须显式配置才能让接口正常放行。这是 NestJS 没有的「副作用」。

---

## 7. 踩坑全记录（Windows + Spring Boot 迁移特辑）

### 坑 #1：MySQL JDBC characterEncoding 参数

```yaml
# ❌ 错误！characterEncoding 接受 Java charset 名，不是 MySQL charset 名
url: jdbc:mysql://localhost:3306/db?characterEncoding=utf8mb4

# ✅ 正确
url: jdbc:mysql://localhost:3306/db?characterEncoding=UTF-8
```

NestJS 用 `mysql2` 驱动，它直接理解 `utf8mb4`；但 Spring Boot 用的是 MySQL Connector J，它要的是 **Java 标准 charset 名**。

### 坑 #2：PowerShell 命令分隔符

```powershell
# ❌ PowerShell 不支持 &&
npm install && npm run build

# ✅ PowerShell 用分号
npm install; npm run build

# 或者直接用 Maven Wrapper 一条命令搞定
.\mvnw.cmd spring-boot:run
```

### 坑 #3：Maven 没装？用 Maven Wrapper！

```powershell
# 不装 Maven，项目里自带 mvnw / mvnw.cmd
.\mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run        # macOS / Linux
```

Maven Wrapper 会自动下载指定版本的 Maven 到 `~/.m2/wrapper/dists/`，**团队每个人用的 Maven 版本完全一致**，CI/CD 也零配置。

### 坑 #4：端口被上一个 Java 进程占用

Spring Boot 对 `ServerPortAlreadyInUseException` 是**硬退出**，不会像 NestJS 那样等几秒重试。快速定位：

```powershell
netstat -ano | findstr :3000     # 找到占用的 PID
taskkill /PID <PID> /F            # 干掉
```

### 坑 #5：jjwt 密钥长度

jjwt 0.12.x 强制要求 HMAC 密钥至少 32 字节。短 secret 直接触发 `WeakKeyException`。解决方案见上文 JwtUtil 的 padding 代码。

---

## 8. 最终运行验证

启动日志干净利落：

```
Tomcat started on port 3000 (http) with context path ''
Started FullstackDemoApplication in 4.645 seconds
```

API 测试（用 PowerShell 的 `Invoke-RestMethod` 或浏览器直接访问）：

```
GET  http://localhost:3000/products
{
  "code": 0,
  "data": [
    { "id": 1, "name": "iPhone 15 Pro", "price": 7999.00, "description": "新款旗舰手机", "createdAt": "2026-09-12T21:08:47" },
    ...
  ],
  "message": "success"
}
```

```
GET  http://localhost:3000/auth/users
{
  "code": 0,
  "data": [
    { "id": 1, "username": "testuser", "email": "test@demo.com", "createdAt": "...", "updatedAt": "..." }
    // ⚠️ password 字段已被剔除！与 NestJS 行为完全一致
  ],
  "message": "success"
}
```

前端零改动，直接把 `npm run dev` 跑起来就能对接 Java 后端 —— 路由、端口、响应格式全部对齐。

---

## 9. 技术栈映射速查表

最后给一张**一页纸速查表**，下次从 Node.js 后端迁到 Spring Boot 时可以直接对照：

| 领域 | NestJS / TypeScript | Spring Boot / Java |
|---|---|---|
| **构建工具** | npm / pnpm | Maven / Gradle |
| **启动入口** | `NestFactory.create(AppModule)` | `@SpringBootApplication` + `SpringApplication.run()` |
| **模块组织** | `@Module` 装饰器 | 包扫描自动装配，不需要 Module 类 |
| **依赖注入** | 构造函数注入（`@Injectable`） | 构造函数注入（`@Service` / `@Component`） |
| **路由定义** | `@Controller()` + `@Get/@Post` | `@RestController` + `@GetMapping/@PostMapping` |
| **DTO 校验** | `class-validator` + 全局 `ValidationPipe` | `jakarta.validation` + 方法参数 `@Valid` |
| **数据库 ORM** | TypeORM（装饰器驱动） | Spring Data JPA（注解驱动） |
| **时间字段** | `@CreateDateColumn` | `@PrePersist` 生命周期回调 |
| **DTO 自动剔除字段** | TypeScript `Omit<User, 'password'>` | 手动拷贝到 SafeUser DTO |
| **密码加密** | `bcrypt` npm 包 | `BCryptPasswordEncoder`（Spring Security） |
| **JWT** | `@nestjs/jwt` | `jjwt`（或自研 JwtUtil） |
| **异常处理** | `ExceptionFilter` | `@ControllerAdvice` |
| **统一响应** | `Interceptor` 包装 | Controller 返回泛型 `ApiResponse<T>` |
| **CORS** | `app.enableCors()` | `SecurityConfig` 里 `CorsConfigurationSource` |
| **环境配置** | `.env` + `dotenv` | `application.yml` / `application.properties` |
| **数据库迁移** | `synchronize: true`（开发） | `ddl-auto: update` |
| **运行端口** | `app.listen(port)` | `server.port` 配置 |

---

## 10. 结语

这次迁移最大的感悟是：**NestJS 和 Spring Boot 看起来像两套东西，但骨子里是一套设计哲学**。

- 都用装饰器/注解做声明式编程
- 都有清晰的 Controller → Service → Repository 分层
- 都强调依赖注入和面向接口编程
- 都把"横切关注点"（校验、异常、CORS）从业务代码中抽离出来

如果你是前端出身想入坑后端，从 NestJS 开始再转 Spring Boot 是一条非常平滑的路径 —— 你会发现自己之前写的"装饰器、DTO、Guard、Module"这些概念，在 Java 里全都找到了对应物，只是换了个注解名而已。

> 本文所有源码在 GitHub 上，见 [server-java/](./server-java/) 目录。原 NestJS 代码在 [server/](./server/) 目录。可以直接 `git clone` 下来本地跑，不依赖任何额外的 Maven 安装（项目自带 mvnw）。
