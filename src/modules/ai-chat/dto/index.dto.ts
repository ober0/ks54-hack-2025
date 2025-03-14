import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'

export class messageDto {
    @ApiProperty({ description: 'message' })
    @IsString()
    @IsNotEmpty()
    message: string

    @ApiProperty({ description: 'chat Uuid' })
    @IsNotEmpty()
    @IsUUID()
    chatUuid: string

    @ApiProperty({ description: 'Файлы', type: 'string', format: 'binary', required: false, isArray: true })
    @IsOptional()
    files?: Express.Multer.File[]
}

export class GetHistoryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    page: string

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    chatUuid: string
}

export class CreateChatDto {
    @ApiProperty({ required: false })
    @IsOptional()
    name?: string
}

export class DeleteChatDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    chatUuid: string
}
