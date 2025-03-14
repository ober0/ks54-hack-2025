import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { SendTextMessageDto } from './dto/index.dto'

@Injectable()
export class AiService {
    private readonly logger = new Logger('OpenAiService')

    private readonly apiKey: string = process.env.OPENAI_API_KEY
    private readonly apiTextUrl: string = 'https://api.openai.com/v1/chat/completions'

    async sendTextMessage(dto: SendTextMessageDto, messages: any) {
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
            return {
                code: 200,
                content: response.data.choices[0].message.content.trim()
            }
        } catch (error) {
            this.logger.error('Ошибка при запросе к OpenAI API:', error)
            throw new BadRequestException({ code: error.status, msg: error.message })
        }
    }

    async sendImgMessage(dto: SendTextMessageDto, messages: Record<any, any>[]) {
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
            return {
                code: 200,
                content: response.data.choices[0].message.content.trim()
            }
        } catch (error) {
            this.logger.error('Ошибка при запросе к OpenAI API:', error)
            throw new BadRequestException({ code: error.status, msg: error.message })
        }
    }
}
