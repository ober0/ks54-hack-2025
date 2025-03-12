import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { DeleteNotificationDto, NotificationDto } from './dto/index.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue('notifications') private readonly notificationsQueue: Queue,
        private readonly prisma: PrismaService
    ) {}

    async scheduleNotification(uuid: string, dto: NotificationDto): Promise<void> {
        const now = new Date()
        const delay = new Date(dto.date).getTime() - now.getTime()

        if (delay <= 0) {
            throw new BadRequestException('Неверная дата')
        }

        const dateObj = new Date(dto.date)
        const stringDate = dateObj
            .toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
            .replace(',', '')

        const notification = await this.prisma.notification.create({
            data: {
                userUuid: uuid,
                when: stringDate,
                notification: dto.message
            }
        })

        await this.notificationsQueue.add({ notificationUuid: notification.uuid }, { delay })
    }

    async getNotification(uuid: string) {
        return this.prisma.notification.findMany({ where: { userUuid: uuid } })
    }

    async deleteNotification(uuid: string, { notificationUuid }: DeleteNotificationDto) {
        const notification = await this.prisma.notification.findFirst({
            where: { uuid: notificationUuid }
        })
        if (notification.userUuid === uuid) {
            return this.prisma.notification.delete({
                where: { uuid: notificationUuid }
            })
        }
        throw new UnauthorizedException('Нет доступа')
    }
}
