// permission.entity.ts
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
  } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Role } from 'src/roles/entities/role.entity';
  
  @Entity()
  export class Permission extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name?: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    role?: Role;
  }
  