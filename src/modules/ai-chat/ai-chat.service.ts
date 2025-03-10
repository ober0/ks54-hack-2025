import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AiService } from '../ai/ai.service'
import { ModelEnum } from '../ai/dto/index.dto'

@Injectable()
export class AiChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService
    ) {}

    async getHistory(uuid: string) {
        return this.prisma.aiChatHistory.findMany({
            where: { userUuid: uuid }
        })
    }

    async processMessage(uuid: string, message: string) {
        const history = await this.getHistory(uuid)
        const messages = [...history, { role: 'user', content: message }]

        return await this.aiService.sendTextMessage(
            {
                max_token: 3000,
                temperature: 0.5,
                answerCount: 1,
                model: ModelEnum.GPT4O_MINI
            },
            messages
        )
    }
}
