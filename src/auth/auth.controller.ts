import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/create-auth.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenResponse, SignInResponse } from 'types/auth.types';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_NAME } from 'src/util';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: AuthDTO })
  @ApiOkResponse({ type: SignInResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.signIn(dto);
    await this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response;
  }

  @ApiBody({ type: AuthDTO })
  @ApiOkResponse({ type: SignInResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.signUp(dto);
    await this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response;
  }

  @ApiBody({ type: RefreshTokenResponse })
  @ApiOkResponse({ type: SignInResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('signin/refresh')
  async tokenUpdate(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookie = req.cookies[REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookie) {
      await this.authService.removeRefreshTokenToResponce(res);
      throw new UnauthorizedException('Токен обновления не передан!');
    }

    const { refreshToken, ...response } = await this.authService.getNewToken(
      refreshTokenFromCookie,
    );
    this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.removeRefreshTokenToResponce(res);
    return true;
  }
}
