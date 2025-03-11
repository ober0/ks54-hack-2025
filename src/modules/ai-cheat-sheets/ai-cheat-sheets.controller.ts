import { Controller, Post, UploadedFiles, Body, UseInterceptors, UseGuards, BadRequestException } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiTags, ApiOperation, ApiBody, ApiSecurity } from '@nestjs/swagger'
import { AiCheatSheetDto } from './dto/index.dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { JwtPayloadDto } from '../auth/dto'
import { AiCheatSheetsService } from './ai-cheat-sheets.service'
import { diskStorage } from 'multer'

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
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|txt|pdf|plain|docx)$/)) {
                    return callback(new BadRequestException('Недопустимый формат файла'), false)
                }
                callback(null, true)
            }
        })
    )
    @ApiOperation({ summary: 'Создать шпаргалку с текстом и изображениями' })
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
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
}
