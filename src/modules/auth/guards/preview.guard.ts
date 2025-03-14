import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PreviewGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest()

        const userData = await this.prisma.user.findUnique({
            where: {
                uuid: user.uuid
            }
        })
        const previewUuid = await this.prisma.role.findFirst({
            where: {
                name: 'preview'
            }
        })

        if (userData.roleUuid !== previewUuid.uuid) {
            return true
        }

        const last3Days = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        const recentMessagesCount = await this.prisma.aiChatHistory.count({
            where: {
                userUuid: user.uuid,
                createdAt: { gte: last3Days }
            }
        })

        const recentCheatSheetsCount = await this.prisma.cheatSheets.count({
            where: {
                userUuid: user.uuid,
                createdAt: { gte: last3Days }
            }
        })

        if (recentMessagesCount + recentCheatSheetsCount < 20) {
            return true
        }

        throw new ForbiddenException('Превышено кол-во бесплатных сообщений')
    }
}
