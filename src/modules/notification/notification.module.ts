import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { NotificationService } from './notification.service'
import { NotificationProcessor } from './notification.processor'
import { PrismaModule } from '../prisma/prisma.module'
import { UserService } from '../user/user.service'
import { RoleService } from '../role/role.service'
import { RoleRepository } from '../role/role.repository'
import { UserRepository } from '../user/user.repository'
import { PasswordService } from '../password/password.service'
import { PermissionService } from '../permission/permission.service'
import { PermissionRepository } from '../permission/permission.repository'
import { SmtpService } from '../smtp/smtp.service'
import { NotificationController } from './notification.controller'
import { RolePermissionService } from '../role-permission/role-permission.service'
import { RolePermissionRepository } from '../role-permission/role-permission.repository'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notifications'
        }),
        PrismaModule
    ],
    providers: [
        NotificationService,
        NotificationProcessor,
        UserService,
        RoleService,
        RoleRepository,
        UserRepository,
        PasswordService,
        PermissionService,
        PermissionRepository,
        SmtpService,
        RolePermissionService,
        RolePermissionRepository,
        PermissionRepository
    ],
    exports: [NotificationService],
    controllers: [NotificationController]
})
export class NotificationModule {}
