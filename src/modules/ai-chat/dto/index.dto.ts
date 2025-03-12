import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class messageDto {
    @ApiProperty({ description: 'message' })
    @IsString()
    @IsNotEmpty()
    message: string
}

export class GetHistoryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    page: string
}
