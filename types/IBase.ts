import { ApiProperty } from '@nestjs/swagger';

export class IBase {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 'clx3968w80001klbslniv3jwf',
  })
  id: string;
  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2023-06-29T11:35:09.918Z',
  })
  createdAt: Date;
}

export class IBaseExtended extends IBase {
  @ApiProperty({
    description: 'Дата обновления пользователя',
    example: '2023-06-29T11:35:09.918Z',
  })
  updatedAt: Date;
}

export class DeleteMessage {
  @ApiProperty({
    description: 'Удаление прошло успешно!',
    example: 'Объект успешно удален!',
  })
  message: string;
}
