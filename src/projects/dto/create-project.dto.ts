import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsNotEmpty, Length } from "class-validator"
import { PROJECT_RULE_LENGTH } from "src/util"

export class ProjectDto {
    @ApiProperty({ description: 'Название проекта', example: "работа" })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: PROJECT_RULE_LENGTH })
    readonly name: string

    @ApiProperty({ description: 'Описсание проекта', example: "Учебные материалы для работы" })
    @IsOptional()
    @IsString()
    readonly description?: string

}
