import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserSession } from "./userSession.model";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  // -> Sessions
  @OneToMany(() => UserSession, (session) => session.user)
  sessions!: UserSession[];
}
