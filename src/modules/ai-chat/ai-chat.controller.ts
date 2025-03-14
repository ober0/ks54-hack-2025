import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { AiChatService } from './ai-chat.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { JwtPayloadDto } from '../auth/dto'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { CreateChatDto, DeleteChatDto, GetHistoryDto, messageDto } from './dto/index.dto'
import { ApiBody, ApiConsumes, ApiOperation, ApiSecurity } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@ApiSecurity('bearer')
@Controller('ai-chat')
export class AiChatController {
    constructor(private readonly aiChatService: AiChatService) {}

    @Get('/history')
    @UseGuards(JwtAuthGuard, ActiveGuard)
    @ApiOperation({ summary: 'Получить историю' })
    async getHistory(@JwtPayload() jwtPayload: JwtPayloadDto, @Query() dto: GetHistoryDto) {
        return this.aiChatService.getHistory(jwtPayload.uuid, dto)
    }

    @Post('/process')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Обработка сообщения' })
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './media/chat/files',
                filename: (req, file, callback) => {
                    const uniqueName = `image_${Date.now()}_${file.originalname}`
                    callback(null, uniqueName)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|txt|pdf|plain|docx|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
                    console.log(file.mimetype)
                    return callback(new BadRequestException('Недопустимый формат файла'), false)
                }
                callback(null, true)
            },
            limits: {
                fileSize: 10 * 1024 * 1024
            }
        })
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                chatUuid: { type: 'string' },
                files: { type: 'array', items: { type: 'string', format: 'binary' } }
            }
        }
    })
    async processMessage(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: messageDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.aiChatService.processMessage(jwtPayload.uuid, dto, files)
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удалить историю' })
    async deleteHistory(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: DeleteChatDto) {
        return this.aiChatService.deleteHistory(jwtPayload.uuid, dto)
    }

    @Get('chat')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Получить все чаты' })
    async getChats(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.aiChatService.getChats(jwtPayload.uuid)
    }

    @Post('chat')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Добавить чат' })
    async createChat(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: CreateChatDto) {
        return this.aiChatService.createChat(jwtPayload.uuid, dto)
    }

    @Delete('chat')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удалить чат по uuid' })
    async deleteChat(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: DeleteChatDto) {
        return this.aiChatService.deleteChat(jwtPayload.uuid, dto)
    }
}
