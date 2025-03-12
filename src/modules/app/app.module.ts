import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RedisModule } from '../redis/redis.module'
import { CryptModule } from '../crypt/crypt.module'
import { PasswordModule } from '../password/password.module'
import { SmtpModule } from '../smtp/smtp.module'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { ConfigModule } from '@nestjs/config'
import config from 'src/config/config'
import { AvatarModule } from '../user/avatar/avatar.module'
import { AiChatModule } from '../ai-chat/ai-chat.module'
import { AiModule } from '../ai/ai.module'
import { AiCheatSheetsModule } from '../ai-cheat-sheets/ai-cheat-sheets.module'
import { BullModule } from '@nestjs/bull'
import { NotificationModule } from '../notification/notification.module'

@Module({
    imports: [
        PrismaModule,
        RedisModule,
        CryptModule,
        PasswordModule,
        SmtpModule,
        UserModule,
        AuthModule,
        AiChatModule,
        AiModule,
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        AvatarModule,
        AiCheatSheetsModule,
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379
            }
        }),
        NotificationModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
