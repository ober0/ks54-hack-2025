import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class messageDto {
    @ApiProperty({ description: 'message' })
    @IsString()
    @IsNotEmpty()
    message: string
}
