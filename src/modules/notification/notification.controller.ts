import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { JwtPayloadDto } from '../auth/dto'
import { DeleteNotificationDto, NotificationDto } from './dto/index.dto'

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

    @Get()
    @ApiOperation({ summary: 'Получить напоминания' })
    @UseGuards(JwtAuthGuard)
    async getNotification(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.notificationService.getNotification(jwtPayload.uuid)
    }

    @Delete()
    @ApiOperation({ summary: 'Удалить напоминание по uuid' })
    @UseGuards(JwtAuthGuard)
    async deleteNotification(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: DeleteNotificationDto) {
        return this.notificationService.deleteNotification(jwtPayload.uuid, dto)
    }
}
