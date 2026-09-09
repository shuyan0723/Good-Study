import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// 🔑 Entity = 后端里的 "数据模型"，对应数据库里的一张表
// 类似前端里定义的 TypeScript interface，但多了数据库映射装饰器
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn() // 自增主键，对应表里的 id 列
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'decimal', precision: 10, scale: 2,
    // 🔑 MySQL DECIMAL 返回字符串，用 transformer 自动转成 number
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  price: number;

  @Column({ nullable: true, length: 500 })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;
}
