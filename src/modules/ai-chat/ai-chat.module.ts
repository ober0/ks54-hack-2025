import { Module } from '@nestjs/common'
import { AiChatService } from './ai-chat.service'
import { AiChatController } from './ai-chat.controller'
import { AiService } from '../ai/ai.service'
import { UserService } from '../user/user.service'
import { RoleService } from '../role/role.service'
import { RoleRepository } from '../role/role.repository'
import { UserRepository } from '../user/user.repository'
import { CryptService } from '../crypt/crypt.service'
import { PasswordService } from '../password/password.service'
import { SmtpService } from '../smtp/smtp.service'
import { PermissionService } from '../permission/permission.service'
import { PermissionRepository } from '../permission/permission.repository'
import { AiCheatSheetsService } from '../ai-cheat-sheets/ai-cheat-sheets.service'

@Module({
    providers: [
        AiChatService,
        AiService,
        UserService,
        RoleService,
        RoleRepository,
        UserRepository,
        PasswordService,
        PermissionService,
        PermissionRepository,
        SmtpService,
        CryptService,
        AiCheatSheetsService
    ],
    controllers: [AiChatController]
})
export class AiChatModule {}
