import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsEmpty,
  MinLength,
  IsDefined,
  IsOptional,
} from 'class-validator';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  @IsEmpty()
  id: number;

  @Column({ length: 100 })
  @MinLength(2)
  @IsDefined()
  authorName: string;

  @Column({ length: 300 })
  @IsDefined()
  @MinLength(2)
  authorDescription: string;

  @Column('text')
  @IsDefined()
  text: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
