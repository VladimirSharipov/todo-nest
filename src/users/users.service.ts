import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserResponse, User } from 'types/users.types';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          username: dto.username, // Предполагается, что вы добавили поле username в dto
          email: dto.email,
          password: await hash(dto.password),
        },
      });
    } catch (error) {
      // Обработка ошибки, например, если пользователь с таким email уже существует
      throw new Error('Ошибка при создании пользователя: ' + error.message);
    }
  }
  //Этот метод создает нового пользователя в базе данных. Он принимает объект UserDto, который содержит данные пользователя,
  ///и возвращает обещание (Promise), которое разрешается в объект User.
  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  //findOneByEmail:
  // Метод ищет пользователя по электронной почте. Если пользователь с такой почтой существует, он будет возвращен.
  async findOneById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  //Похож на предыдущий метод, но ищет пользователя по уникальному идентификатору (ID).
  async update(id: string, dto: UserDto): Promise<UpdateUserResponse> {
    let data = dto;
    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: { username: true, email: true },
    });
  }
  // Обновляет данные существующего пользователя. Если в UserDto есть пароль, он сначала хэшируется. Затем обновленные данные сохраняются в базе данных,
  /// и возвращается объект UpdateUserResponse с обновленными данными пользователя.
  async remove(id: string): Promise<{ message: string }> {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Пользователь успешно удален!' };
  }
  //Удаляет пользователя из базы данных по ID. Возвращает сообщение об успешном удалении.
}
//Этот метод создает нового пользователя в базе данных. Он принимает объект UserDto, который содержит данные пользователя,
///и возвращает обещание (Promise), которое разрешается в объект User.
//findOneByEmail:
// Метод ищет пользователя по электронной почте. Если пользователь с такой почтой существует, он будет возвращен.
//Похож на предыдущий метод, но ищет пользователя по уникальному идентификатору (ID).
// Обновляет данные существующего пользователя. Если в UserDto есть пароль, он сначала хэшируется. Затем обновленные данные сохраняются в базе данных,
/// и возвращается объект UpdateUserResponse с обновленными данными пользователя.