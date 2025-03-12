import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { NotificationDto } from './dto/index.dto'

@Injectable()
export class NotificationService {
    constructor(@InjectQueue('notifications') private readonly notificationsQueue: Queue) {}

    async scheduleNotification(uuid: string, dto: NotificationDto): Promise<void> {
        const now = new Date()
        const delay = new Date(dto.date).getTime() - now.getTime()

        if (delay <= 0) {
            throw new BadRequestException('Неверная дата')
        }

        await this.notificationsQueue.add({ uuid, message: dto.message }, { delay })
    }
}
