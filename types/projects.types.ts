import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './IBase';
import { StatusesResponse } from './statuses.types';

export class CreateProjectsResponse extends IBase {
  @ApiProperty({ description: 'Название проекта', example: 'Учёба' })
  name: string;

  @ApiProperty({
    description: 'Описсание проекта',
    example: 'Учебные материалы для ...',
  })
  description: string;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 'clx22fhxz0000frhk7ibh7o3o',
  })
  userId: string;
}

export class ProjectsResponse extends CreateProjectsResponse {
  @ApiProperty({
    description: 'Имя пользователя',
    example: [
      {
        id: 'clx3968w80001klbslniv3jwf',
        createdAt: '2024-06-06T12:47:49.640Z',
        name: '1 проект',
        description: '1 проект - описание',
        statuses: [
          {
            id: 'clx37pkr20001rpw4i51f3vfx',
            name: 'Todo',
            tasks: [
              {
                id: 'clx37l48q0001ckthfwhmgn5o',
                createdAt: '2024-06-06T12:03:24.218Z',
                name: 'спать',
                description: 'работать',
              },
            ],
          },
        ],
      },
    ],
  })
  statuses: StatusesResponse[];
}
