import { ApiProperty } from '@nestjs/swagger'

export class NotificationDto {
    @ApiProperty()
    date: Date

    @ApiProperty()
    message: string
}
