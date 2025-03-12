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
    async handleNotification(job: Job<{ uuid: string; message: string }>): Promise<void> {
        const { uuid, message } = job.data

        const user = await this.prisma.user.findUnique({
            where: { uuid },
            select: { email: true }
        })

        if (user) {
            const now = new Date()
            const formattedDate = now
                .toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
                .replace(',', '')

            await this.smtpService.send(user.email, `Вы просили напомнить вам в ${formattedDate}: ${message}`, 'Напоминание команды Null')
        } else {
            this.logger.warn(`Пользователь с ${uuid} не найден.`)
        }
    }
}
