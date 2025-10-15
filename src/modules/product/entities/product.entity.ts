import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/*
  @ManyToOne -> @OneToMany: @ManyToOne Is The Owner (FK In This Table)
  @OneToOne -> @OneToOne: One Side Must Be The Owner (FK With @JoinColumn)
  @ManyToMany -> @ManyToMany: @JoinTable Creates The Join Table (FKs From Both Sides)
*/

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  product: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;
}
