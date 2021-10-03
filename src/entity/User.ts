import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, BeforeInsert } from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';
import { Todo } from './Todo';
import { Token } from './Token';
import bcrypt from 'bcryptjs';
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  user_name: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todo: Todo[];

  @OneToMany(() => Token, (token) => token.user)
  token: Token[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  toJson() {
    return classToPlain(this);
  }

  isValidPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
