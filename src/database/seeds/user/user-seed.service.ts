import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { RoleService } from 'src/roles/roles.service';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private roleService: RoleService
  ) { }

  async run() {
    const findAdmin = await this.roleService.findByName(RoleEnum.super_admin);

    await this.repository.save(
      this.repository.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@duretrip.com',
        password: 'P@ssWord_123',
        role: {
          id: findAdmin?.id,
        },
        status: {
          id: StatusEnum.active,
        },
      }),
    );

    const findUser = await this.roleService.findByName(RoleEnum.user);

    await this.repository.save(
      this.repository.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        role: {
          id: findUser?.id,
        },
        status: {
          id: StatusEnum.active,
        },
      }),
    );
  }
}
