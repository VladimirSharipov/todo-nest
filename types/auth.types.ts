import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './users.types';

export class SignInResponse {
  @ApiProperty({
    description: 'Данные пользовтеля',
    example: {
      id: 'clx200ob5000012e0g671ag9q',
      createdAt: '2024-06-05T15:43:46.961Z',
      updatedAt: '2024-06-05T15:43:46.961Z',
      email: '1234@mail.ru',
      username: '',
    },
  })
  user: UserResponse;
  @ApiProperty({ description: 'Токен пользовтеля', example: 'eyJhbGciOiJ...' })
  accessToken: string;
}
export class RefreshTokenResponse {
  @ApiProperty({
    description: 'Серверный cookie токен пользовтеля',
    example: 'Серверный cookie токен пользовтеля',
  })
  refreshToken: string;
}

export class AuthTokensResponse extends RefreshTokenResponse {
  @ApiProperty({ description: 'Токен пользовтеля', example: 'eyJhbGciOiJ...' })
  accessToken: string;
}

export class AuthResponse extends AuthTokensResponse {
  user: UserResponse;
}
