import { Injectable } from '@nestjs/common'
import { AiCheatSheetDto } from './dto/index.dto'
import { JwtPayloadDto } from '../auth/dto'

@Injectable()
export class AiCheatSheetsService {
    async processCheatSheet(dto: AiCheatSheetDto, files: Express.Multer.File[], jwtPayload: JwtPayloadDto) {
        // const filePaths = await this.saveFiles(files, jwtPayload)
        console.log(files)
        console.log(dto.title, dto.content)
    }
}
