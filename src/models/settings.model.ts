import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("settings_groups")
export class SettingsGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  description!: string;

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

  // [Relationships]
  // => Settings
  @OneToMany(() => Setting, (setting) => setting.settings_group)
  settings!: Setting[];
}

@Entity("settings")
@Unique(["settings_group_id", "name"])
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => SettingsGroup, (settingsGroup) => settingsGroup.settings)
  @JoinColumn({ name: "settings_group_id" })
  settings_group?: SettingsGroup;

  @Column({ type: "uuid", nullable: true })
  settings_group_id?: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  value!: string;

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
}
