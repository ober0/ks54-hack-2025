import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'

@Controller()
@ApiSecurity('bearer')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @UseGuards(JwtAuthGuard, ActiveGuard)
    @Get('status')
    async status() {
        return await this.appService.status()
    }
}
