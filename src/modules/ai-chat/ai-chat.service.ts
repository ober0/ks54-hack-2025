import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AiService } from '../ai/ai.service'
import { ModelEnum } from '../ai/dto/index.dto'
import { GetHistoryDto } from './dto/index.dto'

@Injectable()
export class AiChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService
    ) {}

    async getHistory(uuid: string, dto: GetHistoryDto) {
        const data = await this.prisma.aiChatHistory.findMany({
            where: { userUuid: uuid },
            take: 25,
            skip: Number(dto.page ?? '0') * 25,
            orderBy: { createdAt: 'desc' }
        })
        return data.reverse()
    }

    async processMessage(uuid: string, message: string) {
        const history = await this.getHistory(uuid, { page: '0' })
        const messages = [...history, { role: 'user', content: message }]
        console.log(messages)
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
                    content:
                        'Ты помощник для студента. Отвечай на его вопросы подробно и уважительно. Отвечай научно, но понятно для 16-20 летнего подростка. Ответ оформи с MD разметкой. В математических формулах, символах, цифрах, каорнях и тд Markdown пиши ТОЛЬКО корректные формулы в LaTeX-синтаксисе. Используй двойные долларовые знаки для формул и математических символов, без лишнего текста или символов.'
                },
                ...messages
            ]
        )

        if (response.code === 200) {
            await this.prisma.aiChatHistory.create({
                data: { userUuid: uuid, role: 'user', content: message }
            })
            await this.prisma.aiChatHistory.create({
                data: { userUuid: uuid, role: 'assistant', content: response.content }
            })

            return response.content
        }
    }

    async deleteHistory(uuid: string) {
        return this.prisma.aiChatHistory.deleteMany({
            where: { userUuid: uuid }
        })
    }
}
