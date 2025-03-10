import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AiChatService } from './ai-chat.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { JwtPayloadDto } from '../auth/dto'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { messageDto } from './dto/index.dto'
import { ApiSecurity } from '@nestjs/swagger'

@ApiSecurity('bearer')
@Controller('ai-chat')
export class AiChatController {
    constructor(private readonly aiChatService: AiChatService) {}

    @Get('/history')
    @UseGuards(JwtAuthGuard, ActiveGuard)
    async getHistory(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.aiChatService.getHistory(jwtPayload.uuid)
    }

    @Post('/process')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async processMessage(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: messageDto) {
        return this.aiChatService.processMessage(jwtPayload.uuid, dto.message)
    }
}
