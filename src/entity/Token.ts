import { User } from './User';
import TokenTypes from '../config/tokens';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ enum: TokenTypes, type: 'enum' })
  type: string;

  @Column({ type: Date })
  expires: Date;

  @Column()
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.token, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
