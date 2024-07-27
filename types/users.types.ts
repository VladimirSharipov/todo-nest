import { ApiProperty } from '@nestjs/swagger';
import { IBaseExtended } from './IBase';
import { ProjectsResponse } from './projects.types';

export class UserResponse extends IBaseExtended {
  @ApiProperty({ description: 'Email пользователя', example: 'Password@12345678' })
  email: string;
  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  username: string;
}

export class UpdateUserResponse {
  @ApiProperty({ description: 'Email пользователя', example: 'Password@12345678' })
  email: string;
  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  username: string;
}

export class User extends UserResponse {
  @ApiProperty({ description: 'Пароль пользователя', example: 'Password@12345678' })
  password: string;
}

export class UserProjects extends UserResponse {
  @ApiProperty({ description: '', example: '' })
  project: ProjectsResponse[];
}
