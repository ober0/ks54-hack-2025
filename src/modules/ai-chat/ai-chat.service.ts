import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AiService } from '../ai/ai.service'
import { ModelEnum } from '../ai/dto/index.dto'
import { CreateChatDto, DeleteChatDto, GetHistoryDto, messageDto } from './dto/index.dto'
import { JwtPayloadDto } from '../auth/dto'
import { AiCheatSheetsService } from '../ai-cheat-sheets/ai-cheat-sheets.service'
import * as fs from 'fs'
import * as path from 'path'
import * as mammoth from 'mammoth'

@Injectable()
export class AiChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService,
        private readonly aiCheatSheetService: AiCheatSheetsService
    ) {}

    async getHistory(uuid: string, dto: GetHistoryDto) {
        const data = await this.prisma.aiChatHistory.findMany({
            where: { userUuid: uuid, chatUuid: dto.chatUuid },
            take: 25,
            skip: Number(dto.page ?? '0') * 25,
            orderBy: { createdAt: 'desc' }
        })
        return data.reverse()
    }

    async processMessage(uuid: string, { message, chatUuid }: messageDto, files: Express.Multer.File[]) {
        const { textFileMessages, imageMessages, fileData } = await this.processFiles(uuid, files)

        const history = await this.getHistory(uuid, { page: '0', chatUuid: chatUuid })

        const messages = [
            ...(
                await Promise.all(
                    history.map(async (data) => {
                        if (data.type === 'TEXT') {
                            return { role: data.role, content: data.content }
                        } else if (data.type === 'FILE') {
                            const messages: Record<string, any>[] = []

                            for (const filename of data.filenames) {
                                const filePath = path.join(__dirname, '/../../../..', '/media/chat/files', filename)
                                const ext = path.extname(filename).toLowerCase()

                                if (ext === '.txt') {
                                    const text = await fs.promises.readFile(filePath, 'utf-8')
                                    messages.push({ role: data.role, content: text })
                                } else if (ext === '.docx') {
                                    const result = await mammoth.extractRawText({ path: filePath })
                                    messages.push({ role: data.role, content: result.value })
                                } else {
                                    const fileBuffer = await fs.promises.readFile(filePath)
                                    const mimeType = this.aiCheatSheetService.getMimeType(filename)
                                    const base64File = `data:${mimeType};base64,${fileBuffer.toString('base64')}`
                                    messages.push({
                                        role: data.role,
                                        content: [
                                            {
                                                type: 'image_url',
                                                image_url: { url: base64File }
                                            }
                                        ]
                                    })
                                }
                            }

                            return messages
                        }
                    })
                )
            ).flat(),
            {
                role: 'user',
                content: [{ type: 'text', text: message }, ...textFileMessages, ...imageMessages]
            }
        ]
        console.log(messages)
        const response = await this.aiService.sendImgMessage(
            {
                max_token: 5000,
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
                data: { userUuid: uuid, role: 'user', content: message, chatUuid, type: 'TEXT' }
            })

            const files: string[] = []
            fileData.map((data) => {
                files.push(data.filename)
            })
            if (files.length > 0) {
                await this.prisma.aiChatHistory.create({
                    data: { userUuid: uuid, role: 'user', filenames: files, chatUuid, type: 'FILE' }
                })
            }

            await this.prisma.aiChatHistory.create({
                data: { userUuid: uuid, role: 'assistant', content: response.content, chatUuid, type: 'TEXT' }
            })

            return response.content
        }
    }

    async deleteHistory(uuid: string, { chatUuid }: DeleteChatDto) {
        return this.prisma.aiChatHistory.deleteMany({
            where: { userUuid: uuid, chatUuid }
        })
    }

    async getChats(uuid: string) {
        return this.prisma.chat.findMany({
            where: { userUuid: uuid }
        })
    }

    async createChat(uuid: string, { name }: CreateChatDto) {
        return this.prisma.chat.create({
            data: {
                userUuid: uuid,
                name
            }
        })
    }

    async deleteChat(uuid: string, { chatUuid }: DeleteChatDto) {
        const chat = await this.prisma.aiChatHistory.findFirst({
            where: {
                userUuid: uuid,
                uuid: chatUuid
            }
        })

        if (!chat) {
            throw new NotFoundException('Чат не найден')
        }

        return this.prisma.aiChatHistory.delete({
            where: {
                uuid: chatUuid
            }
        })
    }

    private async processFiles(uuid: string, files: Express.Multer.File[]) {
        const filenames = await Promise.all(files.map(async (file) => file.filename))
        const fileData = await Promise.all(
            filenames.map(async (file) => {
                return {
                    userUuid: uuid,
                    filename: file
                }
            })
        )

        const { base64Files, txtFiles } = await this.aiCheatSheetService.convertFilesToBase64(files, true)

        const imageMessages = await Promise.all(
            base64Files.map((data) => {
                return {
                    type: 'image_url',
                    image_url: {
                        url: data
                    }
                }
            })
        )
        const textFileMessages = txtFiles.map((data) => {
            return {
                type: 'text',
                text: data
            }
        })

        return {
            textFileMessages,
            imageMessages,
            fileData
        }
    }
}
