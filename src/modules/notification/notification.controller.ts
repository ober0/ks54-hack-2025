import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { JwtPayloadDto } from '../auth/dto'
import { NotificationDto } from './dto/index.dto'

@ApiTags('Notification')
@ApiSecurity('bearer')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Создать отложенное напоминание' })
    @UseGuards(JwtAuthGuard)
    async createNotification(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: NotificationDto) {
        return this.notificationService.scheduleNotification(jwtPayload.uuid, dto)
    }
}
