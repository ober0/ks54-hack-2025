import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common'
import { AiChatService } from './ai-chat.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { JwtPayloadDto } from '../auth/dto'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { GetHistoryDto, messageDto } from './dto/index.dto'
import { ApiOperation, ApiSecurity } from '@nestjs/swagger'

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
    async processMessage(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: messageDto) {
        return this.aiChatService.processMessage(jwtPayload.uuid, dto.message)
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удалить историю' })
    async deleteHistory(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.aiChatService.deleteHistory(jwtPayload.uuid)
    }
}
