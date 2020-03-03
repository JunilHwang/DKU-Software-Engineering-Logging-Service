import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
}