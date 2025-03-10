import { ApiProperty } from '@nestjs/swagger'
import { IsBase64, IsEnum, IsOptional, Max, Min } from 'class-validator'

export enum ModelEnum {
    GPT4 = 'gpt-4',
    GPT4_TURBO = 'gpt-4-turbo',
    GPT4O_MINI = 'gpt-4o-mini'
}

export class SendTextMessageDto {
    @ApiProperty()
    message: string

    @ApiProperty()
    @Max(1000)
    max_token: number

    @ApiProperty()
    @Min(0)
    @Max(1)
    temperature: number

    @ApiProperty()
    answerCount: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ModelEnum)
    model: ModelEnum
}

export class SendImgMessageDto extends SendTextMessageDto {
    @ApiProperty()
    img_base64: string
}

export class sendJsonMessageDto {
    max_token: number
    temperature: number
    answerCount: number
    messages: any[]
    response_format: any
}
