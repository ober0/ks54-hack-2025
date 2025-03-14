import { Controller, Post, UploadedFiles, Body, UseInterceptors, UseGuards, BadRequestException, Get, Delete } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiTags, ApiOperation, ApiBody, ApiSecurity } from '@nestjs/swagger'
import { AiCheatSheetDto, DeleteCheatSheetDto } from './dto/index.dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { JwtPayloadDto } from '../auth/dto'
import { AiCheatSheetsService } from './ai-cheat-sheets.service'
import { diskStorage } from 'multer'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PreviewGuard } from '../auth/guards/preview.guard'

@ApiSecurity('bearer')
@Controller('ai-cheat-sheets')
@ApiTags('AI Cheat Sheets')
export class AiCheatSheetsController {
    constructor(private readonly aiCheatSheetsService: AiCheatSheetsService) {}

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './media/files/',
                filename: (req, file, callback) => {
                    const uniqueName = `image_${Date.now()}_${file.originalname}`
                    callback(null, uniqueName)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|txt|pdf|plain|docx|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
                    return callback(new BadRequestException('Недопустимый формат файла'), false)
                }
                callback(null, true)
            },
            limits: {
                fileSize: 10 * 1024 * 1024
            }
        })
    )
    @ApiOperation({ summary: 'Создать шпаргалку с текстом и изображениями' })
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard, ActiveGuard, PreviewGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                files: { type: 'array', items: { type: 'string', format: 'binary' } }
            }
        }
    })
    async createCheatSheet(@Body() dto: AiCheatSheetDto, @UploadedFiles() files: Express.Multer.File[], @JwtPayload() jwtPayload: JwtPayloadDto) {
        return await this.aiCheatSheetsService.processCheatSheet(dto, files, jwtPayload)
    }

    @UseGuards(JwtAuthGuard, ActiveGuard)
    @Get()
    async getCheatSheet(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return await this.aiCheatSheetsService.getCheatSheet(jwtPayload.uuid)
    }

    @UseGuards(JwtAuthGuard, ActiveGuard)
    @Delete()
    async deleteCheatSheet(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: DeleteCheatSheetDto) {
        return await this.aiCheatSheetsService.deleteCheatSheet(jwtPayload.uuid, dto)
    }
}
