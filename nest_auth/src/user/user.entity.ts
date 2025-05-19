import { Entity, Column } from 'typeorm';

@Entity()
export class User {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
