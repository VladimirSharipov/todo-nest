import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDTO } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { AuthResponse, AuthTokensResponse } from 'types/auth.types';
import { User } from 'types/users.types';
import {
  ACCESS_JWT_EXPIRATION_TIME,
  REFRESH_JWT_EXPIRATION_TIME,
  REFRESH_TOKEN_NAME,
} from 'src/util';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UsersService,
  ) {}

  private async validateUser(dto: AuthDTO): Promise<User> {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) throw new NotFoundException('Такой пользователь не существует!');
    const passwordValid = await verify(user.password, dto.password);
    if (!passwordValid)
      throw new UnauthorizedException('Неверный пароль пользователя!');
    return user;
  }

  private async issueToken(userId: string): Promise<AuthTokensResponse> {
    const data = { id: userId };
    const accessToken = await this.jwt.signAsync(data, {
      expiresIn: `${ACCESS_JWT_EXPIRATION_TIME}`,
    });
    const refreshToken = await this.jwt.signAsync(data, {
      expiresIn: `${REFRESH_JWT_EXPIRATION_TIME}d`,
      secret: process.env.JWT_REFRESH_TOKEN,
    });
    return { accessToken, refreshToken };
  }

  async signIn(dto: AuthDTO): Promise<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.validateUser(dto);
    const tokens = await this.issueToken(user.id);
    return { user, ...tokens };
  }

  async signUp(dto: AuthDTO): Promise<AuthResponse> {
    const userVerification = await this.userService.findOneByEmail(dto.email);
    if (userVerification)
      throw new BadRequestException('Такой пользователь существует!');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.create(dto);
    const tokens = await this.issueToken(user.id);
    return { user, ...tokens };
  }

  async addRefreshTokenToResponce(response: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + +REFRESH_JWT_EXPIRATION_TIME);
    return await this.cookieResponse(response, refreshToken, expiresIn);
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN,
    });
    if (!result) throw new UnauthorizedException('Неверный токен обновления!');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.findOneById(result.id);
    const tokens = await this.issueToken(user.id);
    return { user, ...tokens };
  }

  async cookieResponse(response: Response, token: string, date: Date) {
    return response.cookie(REFRESH_TOKEN_NAME, token, {
      httpOnly: true,
      domain: `${process.env.DOMAIN}`,
      expires: date,
      secure: true,
      sameSite: 'lax',
    });
  }

  async removeRefreshTokenToResponce(response: Response) {
    const date = new Date(0);
    return await this.cookieResponse(response, '', date);
  }
}
