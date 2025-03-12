import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { AiCheatSheetDto, DeleteCheatSheetDto } from './dto/index.dto'
import { JwtPayloadDto } from '../auth/dto'
import * as fs from 'fs'
import * as path from 'path'
import * as mammoth from 'mammoth'
import { PrismaService } from '../prisma/prisma.service'
import { AiService } from '../ai/ai.service'
import { ModelEnum } from '../ai/dto/index.dto'

@Injectable()
export class AiCheatSheetsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService
    ) {}

    async processCheatSheet(dto: AiCheatSheetDto, files: Express.Multer.File[], jwtPayload: JwtPayloadDto) {
        const filenames = await Promise.all(files.map(async (file) => file.filename))
        const fileData = await Promise.all(
            filenames.map(async (file) => {
                return {
                    userUuid: jwtPayload.uuid,
                    filename: file
                }
            })
        )

        const { base64Files, txtFiles } = await this.convertFilesToBase64(files)

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
        const messages = [
            {
                role: 'developer',
                content:
                    'Твоя задача изучить файлы и описание если они есть и на основе их выдать краткую но емкую информацией шпоргалку для студента в тексстовом формате, с MD разметкой. В математических формулах Markdown пиши ТОЛЬКО корректные формулы в LaTeX-синтаксисе. Используй двойные долларовые знаки для формул и математических символов, без лишнего текста или символов.'
            },
            {
                role: 'user',
                content: [{ type: 'text', text: dto.content }, ...textFileMessages, ...imageMessages]
            }
        ]
        const response = await this.aiService.sendImgMessage(
            {
                max_token: 5000,
                temperature: 0.6,
                answerCount: 1,
                model: ModelEnum.GPT4O_MINI
            },
            messages
        )
        if (response.code === 200) {
            const files = await Promise.all(fileData.map((data) => this.prisma.files.create({ data, select: { uuid: true } })))
            const fileUuids = files.map((file) => file.uuid)

            await this.prisma.cheatSheets.create({
                data: {
                    userUuid: jwtPayload.uuid,
                    name: dto.title,
                    description: dto.content,
                    filesUuid: fileUuids,
                    response: response.content
                }
            })
            return {
                msg: response.content
            }
        } else {
            throw new InternalServerErrorException('Неизвестная ошибка')
        }
    }

    private async convertFilesToBase64(files: Express.Multer.File[]): Promise<{ base64Files: string[]; txtFiles: string[] }> {
        const base64Files: string[] = []
        const txtFiles: string[] = []

        for (const file of files) {
            const filePath = path.join(__dirname, '..', '..', '..', '..', 'media', 'files', file.filename)
            const ext = path.extname(file.filename).toLowerCase()

            try {
                if (ext === '.txt') {
                    // Читаем текстовый файл
                    const text = await fs.promises.readFile(filePath, 'utf-8')
                    txtFiles.push(text)
                } else if (ext === '.docx') {
                    // Используем mammoth для извлечения текста из docx
                    const result = await mammoth.extractRawText({ path: filePath })
                    txtFiles.push(result.value)
                } else {
                    // Для остальных типов файлов читаем буфер и конвертируем в Base64
                    const fileBuffer = await fs.promises.readFile(filePath)
                    const mimeType = this.getMimeType(file.filename) // например, 'image/jpeg', 'image/png' и т.д.
                    const base64File = `data:${mimeType};base64,${fileBuffer.toString('base64')}`
                    base64Files.push(base64File)
                }
            } catch (error) {
                console.error(`Ошибка чтения файла ${file.filename}:`, error)
            }
        }

        return { base64Files, txtFiles }
    }

    private getMimeType(filename: string): string {
        const ext = path.extname(filename).toLowerCase()
        const mimeTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        }
        return mimeTypes[ext] || null
    }

    async getCheatSheet(uuid: string) {
        const data = await this.prisma.cheatSheets.findMany({
            where: {
                userUuid: uuid
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return data.map((data) => {
            return {
                uuid: data.uuid,
                name: data.name,
                response: data.response,
                createdAt: data.createdAt
            }
        })
    }

    async deleteCheatSheet(uuid: string, dto: DeleteCheatSheetDto) {
        return this.prisma.cheatSheets.delete({
            where: {
                userUuid: uuid,
                uuid: dto.cheatSheetUuid
            }
        })
    }
}
