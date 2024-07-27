import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TASK_RULE_LENGTH } from 'src/util';

export class StatusIdDto {
  @ApiProperty({ description: 'Уникальный идентификатор проекта', example: "clx31ne1700013pzzcen2jla2" })
  @IsNotEmpty()
  @IsString()
  readonly statusId: string
}

export class TaskDto extends StatusIdDto {
  @ApiProperty({ description: 'Название задачи', example: "to do" })
  @IsNotEmpty()
  @IsString()
  @Length(5, 150, { message: TASK_RULE_LENGTH })
  readonly name: string

  @ApiProperty({ description: 'Описсание задачи', example: "Какое-то описание ..." })
  @IsOptional()
  @IsString()
  readonly description?: string
}

export class UpdateOrderDto extends StatusIdDto {
  @ApiProperty({
      description: 'Порядковые номер столбца статуса задачи',
      example: [
          "clx31nibq00033pzz8cck5u2s",
          "clx31ne1700013pzzcen2jla2"]
  })
  @IsOptional()
  @IsArray()
  readonly ids?: [string]
}