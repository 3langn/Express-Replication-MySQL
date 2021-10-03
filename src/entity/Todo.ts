import { classToPlain, Exclude } from 'class-transformer';
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
import TaskStatus from '../config/task';
import { User } from './User';

@Entity({ name: 'todos' })
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name_task: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: string;

  @Column()
  date_of_completion: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.todo, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  toJson() {
    return {
      id: this.id,
      name_task: this.name_task,
      description: this.description,
      date_of_completion: this.date_of_completion,
      status: this.status,
      user: {
        id: this.user.id,
        username: this.user.user_name,
      },
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
