import {
  Controller,
  Get,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserResponse, UserResponse } from 'types/users.types';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { DeleteMessage } from 'types/IBase';

@ApiTags('Пользователи')
@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findOne(@CurrentUser('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = await this.usersService.findOneById(id);
    return profile;
  }
  //Декоратор @CurrentUser('id') извлекает ID текущего пользователя из запроса, используя кастомный декоратор CurrentUser.
  //Сервис usersService вызывает метод findOneById, передавая ему ID пользователя.
  //Полученный объект пользователя содержит поле password, которое не должно возвращаться клиенту для обеспечения безопасности.
  //Оператор деструктуризации { password, ...profile } используется для исключения поля password из возвращаемого объекта.
  //Возвращается объект profile, который содержит все поля пользователя, кроме пароля.

  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: UpdateUserResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete()
  async remove(@CurrentUser('id') id: string) {
    return this.usersService.remove(id);
  }
}
