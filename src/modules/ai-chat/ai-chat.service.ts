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

        const response = await this.aiService.sendTextMessage(
            {
                max_token: 3000,
                temperature: 0.5,
                answerCount: 1,
                model: ModelEnum.GPT4O_MINI
            },
            [
                {
                    role: 'developer',
                    content: 'Ты помощник для студента. Отвечай на его вопросы подробно и уважительно. Отвечай научно, но понятно для 16-20 летнего подростка. Ответ оформи с MD разметкой'
                },
                ...messages
            ]
        )
        if (response.code === 200) {
            await Promise.all([
                this.prisma.aiChatHistory.create({
                    data: { userUuid: uuid, role: 'user', content: message }
                }),
                this.prisma.aiChatHistory.create({
                    data: { userUuid: uuid, role: 'assistant', content: response.content }
                })
            ])

            return response.content
        }
    }
}
