import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import axios from 'axios'
import { SendImgMessageDto, SendTextMessageDto } from './dto/index.dto'

@Injectable()
export class AiService {
    private readonly logger = new Logger('OpenAiService')

    private readonly apiKey: string = process.env.OPENAI_API_KEY
    private readonly apiTextUrl: string = 'https://api.openai.com/v1/chat/completions'

    async sendTextMessage(dto: SendTextMessageDto, messages: Record<string, string>[]) {
        try {
            const response = await axios.post(
                this.apiTextUrl,
                {
                    model: dto.model ?? 'gpt-4o-mini',
                    store: true,
                    max_tokens: dto.max_token,
                    temperature: dto.temperature,
                    messages: messages
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return response.data.choices[0].message.content.trim()
        } catch (error) {
            this.logger.error('Ошибка при запросе к OpenAI API:', error)
            throw new InternalServerErrorException('Не удалось проанализировать текст')
        }
    }

    async sendImgMessage(dto: SendImgMessageDto, messages: Record<string, string>[]) {
        try {
            const response = await axios.post(
                this.apiTextUrl,
                {
                    model: dto.model ?? 'gpt-4o-mini',
                    store: true,
                    max_tokens: dto.max_token,
                    temperature: dto.temperature,
                    messages
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return response.data.choices[0].message.content.trim()
        } catch (error) {
            this.logger.error('Ошибка при запросе к OpenAI API:', error)
            throw new InternalServerErrorException('Не удалось проанализировать текст')
        }
    }
}

// [
//     { role: 'developer', content: 'Ты ассистент-помощник на крипто и акционной бирже. Веди себя максимально корректно' },
//     {
//         role: 'user',
//         content: [
//             { type: 'text', text: dto.message },
//             {
//                 type: 'image_url',
//                 image_url: {
//                     url: dto.img_base64
//                 }
//             }
//         ]
//     }
// ]
