import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SmtpService } from '../smtp/smtp.service'

@Injectable()
@Processor('notifications')
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly smtpService: SmtpService
    ) {}

    @Process()
    async handleNotification(job: Job<{ notificationUuid: string }>): Promise<void> {
        const { notificationUuid } = job.data

        const notification = await this.prisma.notification.findUnique({
            where: {
                uuid: notificationUuid
            }
        })

        if (!notification) {
            return
        }

        const user = await this.prisma.user.findUnique({
            where: { uuid: notification.userUuid },
            select: { email: true, uuid: true }
        })

        if (user) {
            await this.prisma.notification.delete({
                where: { uuid: notificationUuid }
            })
            await this.smtpService.send(user.email, `Вы просили напомнить вам в ${notification.when}: ${notification.notification}`, 'Напоминание команды Null')
        } else {
            this.logger.warn(`Пользователь с ${user.uuid} не найден.`)
        }
    }
}
