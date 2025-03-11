import { Module } from '@nestjs/common'
import { AiCheatSheetsController } from './ai-cheat-sheets.controller'
import { AiCheatSheetsService } from './ai-cheat-sheets.service'
import { AiService } from '../ai/ai.service'
import { UserService } from '../user/user.service'
import { RoleService } from '../role/role.service'
import { RoleRepository } from '../role/role.repository'
import { UserRepository } from '../user/user.repository'
import { PasswordService } from '../password/password.service'
import { PermissionService } from '../permission/permission.service'
import { PermissionRepository } from '../permission/permission.repository'
import { SmtpService } from '../smtp/smtp.service'
import { CryptService } from '../crypt/crypt.service'

@Module({
    controllers: [AiCheatSheetsController],
    providers: [AiCheatSheetsService, AiService, UserService, RoleService, RoleRepository, UserRepository, PasswordService, PermissionService, PermissionRepository, SmtpService, CryptService]
})
export class AiCheatSheetsModule {}
