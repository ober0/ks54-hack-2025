import { Module } from '@nestjs/common'
import { AiChatService } from './ai-chat.service'
import { AiChatController } from './ai-chat.controller'
import { AiService } from '../ai/ai.service'

@Module({
    providers: [AiChatService, AiService],
    controllers: [AiChatController]
})
export class AiChatModule {}
