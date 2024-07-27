import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './IBase';

export class CreateTasksResponse extends IBase {
  @ApiProperty({ description: 'Название задачи', example: 'to do' })
  name: string;

  @ApiProperty({
    description: 'Описание задачи',
    example: 'Учебные материалы для ...',
  })
  description: string;

  @ApiProperty({ description: 'Порядковые номер задачи', example: '1' })
  order: number;
}

export class TasksResponse extends IBase {
  @ApiProperty({ description: 'Название задачи', example: 'to do' })
  name: string;

  @ApiProperty({
    description: 'Описание задачи',
    example: 'Учебные материалы для ...',
  })
  description: string;
}

export class UpdateOrderTasksResponse {
  @ApiProperty({
    example: [
      {
        id: '58irjegijr4545hrtht',
        createdAt: '2024-06-15T20:07:03.849Z',
        name: 'Сесть за работу',
        description: 'спатьь',
      },
      {
        id: 'clmvomup4894up35',
        createdAt: '2024-06-15T20:07:03.849Z',
        name: 'Сделать перерыв',
        description: 'спатьь',
      },
      {
        id: 'clx3bberbb45nsj8074',
        createdAt: '2024-06-06T20:05:55.775Z',
        name: 'Сесть за работу',
        description: 'спатьь',
      },
    ],
  })
  response: [];
}
