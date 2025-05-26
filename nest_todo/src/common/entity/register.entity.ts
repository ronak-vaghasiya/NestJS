import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Register {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  profilePicture?: string;
}
