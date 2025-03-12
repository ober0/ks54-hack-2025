import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { Express } from 'express'

export class AiCheatSheetDto {
    @ApiProperty({ description: 'Название шпаргалки' })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ description: 'Текстовое содержимое шпаргалки' })
    @IsString()
    @IsNotEmpty()
    content: string

    @ApiProperty({ description: 'Файлы (PNG/JPG)', type: 'string', format: 'binary', required: false, isArray: true })
    @IsOptional()
    files?: Express.Multer.File[]
}

export class DeleteCheatSheetDto {
    @ApiProperty()
    @IsUUID()
    cheatSheetUuid: string
}
