import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.model";

import { eUserSessionLogoutTypes } from "../constants/user.constant";

@Entity("user_sessions")
export class UserSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({
    name: "user_id",
  })
  user!: User;

  @Column({
    type: "uuid",
  })
  user_id!: string;

  @Column({
    type: "timestamp with time zone",
  })
  date_logged_in!: Date;

  @Column({
    type: "timestamp with time zone",
  })
  token_expires_by!: Date;

  @Column({
    type: "enum",
    enum: eUserSessionLogoutTypes,
    nullable: true,
  })
  logout_type?: eUserSessionLogoutTypes;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  date_logged_out?: Date;
}
