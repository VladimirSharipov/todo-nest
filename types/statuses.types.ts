import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusesResponse {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 'clx3968w80001klbslniv3jwf',
  })
  id: string;

  @ApiProperty({ description: 'Название статуса задачи', example: 'to do' })
  name: string;

  @ApiProperty({
    description: 'Порядковые номер столбца статуса задачи',
    example: '1',
  })
  order: number;
}

export class StatusesResponse {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 'clx3968w80001klbslniv3jwf',
  })
  id: string;

  @ApiProperty({ description: 'Название статуса задачи', example: 'to do' })
  name: string;
}

export class UpdateOrderStatusesResponse {
  @ApiProperty({
    example: [
      {
        id: 'clx31nibq00033pzz8cck5u2s',
        name: 'First',
      },
      {
        id: 'clx31ne1700013pzzcen2jla2',
        name: 'To do',
      },
    ],
  })
  response: [];
}
