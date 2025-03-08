import { forwardRef, Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { RolePermissionModule } from '../role-permission/role-permission.module'
import { UserModule } from '../user/user.module'
import { RoleRepository } from './role.repository'
import { PrismaService } from '../prisma/prisma.service'
import { PermissionModule } from '../permission/permission.module'

@Module({
    controllers: [RoleController],
    providers: [RoleService, PrismaService, RoleRepository],
    exports: [RoleService],
    imports: [PermissionModule, forwardRef(() => UserModule), RolePermissionModule]
})
export class RoleModule {}
