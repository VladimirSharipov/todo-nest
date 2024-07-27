import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDto, UpdateOrderDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { RabbitMQService } from 'src/rabbitmq.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async create(userId: string, dto: TaskDto) {
    try {
      const count = await this.prisma.task.count({
        where: { statusId: dto.statusId, userId },
      });
      const task = await this.prisma.task.create({
        data: {
          name: dto.name,
          description: dto.description,
          order: count,
          statusId: dto.statusId,
          userId,
        },
        select: {
          id: true,
          createdAt: true,
          name: true,
          description: true,
          order: true,
        },
      });

      // Отправка сообщения в RabbitMQ
      const message = JSON.stringify(task);
      await this.rabbitMQService.sendMessageToQueue(message);

      return task;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(userId: string, statusId: string) {
    try {
      return await this.prisma.task.findMany({
        where: { userId, statusId },
        select: { id: true, createdAt: true, name: true, description: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(userId: string, statusId: string, id: string) {
    try {
      return await this.prisma.task.findUnique({
        where: { userId, id, statusId },
        select: { id: true, createdAt: true, name: true, description: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(userId: string, id: string, dto: TaskDto) {
    try {
      const count = await this.prisma.task.count({
        where: { statusId: dto.statusId, userId },
      });
      const task = await this.prisma.task.update({
        where: { id, userId },
        data: {
          name: dto.name,
          description: dto.description,
          statusId: dto.statusId,
          order: count,
        },
        select: {
          id: true,
          createdAt: true,
          name: true,
          description: true,
          order: true,
        },
      });

      // Отправка сообщения в RabbitMQ
      const message = JSON.stringify(task);
      await this.rabbitMQService.sendMessageToQueue(message);

      return task;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const task = await this.prisma.task.findUnique({ where: { userId, id } });
      if (!task)
        throw new HttpException(
          `Произошла ошибка удаления задачи! Задание не найдено!`,
          HttpStatus.NOT_FOUND,
        );
      await this.prisma.task.delete({ where: { id, userId } });

      // Отправка сообщения об удалении в RabbitMQ
      const message = JSON.stringify({ action: 'delete', taskId: id });
      await this.rabbitMQService.sendMessageToQueue(message);

      return { message: 'Задача успешно удалена!' };
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOrderTasks(userId: string, dto: UpdateOrderDto) {
    try {
      const tasks = await this.prisma.$transaction(
        dto.ids.map((id, order) =>
          this.prisma.task.update({
            where: { id, userId },
            data: { order },
            select: {
              id: true,
              createdAt: true,
              name: true,
              description: true,
            },
          }),
        ),
      );

      // Отправка сообщения об обновлении порядка задач в RabbitMQ
      const message = JSON.stringify({ action: 'updateOrder', tasks });
      await this.rabbitMQService.sendMessageToQueue(message);

      return tasks;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025': // Пример кода ошибки, требующего особой обработки
          throw new HttpException(
            `Запись не найдена! ${error}`,
            HttpStatus.NOT_FOUND,
          );
        default:
          throw new HttpException(
            `Ошибка базы данных! ${error}`,
            HttpStatus.BAD_REQUEST,
          );
      }
    } else {
      console.error('Unhandled error:', error);
      throw new HttpException(
        `Произошла необработанная ошибка! ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}



//Create: Создает новую задачу для пользователя. Сначала подсчитывает количество задач с тем же статусом, что и новая задача, затем создает задачу с этим порядковым номером.
//findAll: Возвращает все задачи пользователя с определенным статусом.
//findOne: Возвращает одну задачу пользователя по уникальному идентификатору и статусу.
///update: Обновляет задачу пользователя. Подсчитывает количество задач с новым статусом и обновляет задачу с новым порядковым номером.
//emove: Удаляет задачу пользователя. Сначала проверяет, существует ли задача, и если нет, выбрасывает исключение.
//updateOrderTasks: Обновляет порядок задач пользователя. Использует транзакцию для обновления порядка нескольких задач.
