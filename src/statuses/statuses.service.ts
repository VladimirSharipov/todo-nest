import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StatusDto, UpdateOrderDto } from './dto/status.dto';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class StatusesService {
  constructor(
    private prisma: PrismaService,
    private projectService: ProjectsService,
  ) {}

  async findOneStatus(userId?: string, id?: string) {
    const status = await this.prisma.status.findUnique({
      where: { userId, id },
    });
    return status;
  }

  async create(userId: string, dto: StatusDto) {
    try {
      const project = await this.projectService.findOneProject(
        userId,
        dto.projectId,
      );
      if (!project)
        throw new HttpException(
          `Произошла ошибка! Такой проект не существует!`,
          HttpStatus.NOT_FOUND,
        );

      const count = await this.prisma.status.count({
        where: { projectId: dto.projectId, userId },
      });
      return await this.prisma.status.create({
        data: {
          name: dto.name,
          order: count,
          projectId: dto.projectId,
          userId,
        },
        select: { id: true, name: true, order: true },
      });
    } catch (error) {
      throw new HttpException(
        `Произошла ошибка создания статуса проекта! ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(userId: string, projectId: string) {
    const project = await this.projectService.findOneProject(userId, projectId)
    if (!project)
      throw new HttpException(
        `Произошла ошибка! Такой проект не существует!`,
        HttpStatus.NOT_FOUND,
      );

    const statuses = await this.prisma.status.findMany({
      where: { userId, projectId: projectId },
      select: { id: true, name: true },
      orderBy: { order: 'asc' },
    });
    if (!statuses)
      throw new HttpException(
        `Произошла ошибка получения статусов проекта!`,
        HttpStatus.NOT_FOUND,
      );
    return statuses;
  }

  async findOne(userId: string, projectId: string, id: string) {
    const project = await this.projectService.findOneProject(userId, projectId);
    if (!project)
      throw new HttpException(
        `Произошла ошибка! Такой проект не существует!`,
        HttpStatus.NOT_FOUND,
      );

    const status = await this.prisma.status.findUnique({
      where: { userId, id },
      select: { id: true, name: true },
    });
    if (!status)
      throw new HttpException(
        `Произошла ошибка получения статуса проекта! Статус проекта не найден!`,
        HttpStatus.NOT_FOUND,
      );
    return status;
  }

  async update(userId: string, id: string, dto: StatusDto) {
    const status = await this.findOneStatus(userId, id);
    if (!status)
      throw new HttpException(
        `Произошла ошибка обновления статуса проекта! Статус проекта не найден!`,
        HttpStatus.NOT_FOUND,
      );
    return this.prisma.status.update({
      where: { id, userId },
      data: {
        name: dto.name,
        order: dto.order,
        projectId: dto.projectId,
        userId,
      },
      select: {
        id: true,
        name: true,
        order: true,
        tasks: {
          select: {
            id: true,
            createdAt: true,
            name: true,
            description: true,
            order: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const status = await this.findOneStatus(userId, id);
    if (!status)
      throw new HttpException(
        `Произошла ошибка удаления статуса проекта! Статус проекта не найден!`,
        HttpStatus.NOT_FOUND,
      );
    await this.prisma.status.delete({ where: { id, userId } });
    return { message: 'Статус проекта успешно удален!' };
  }

  async updateOrderStatuses(userId: string, dto: UpdateOrderDto) {
    try {
      return await this.prisma.$transaction(
        dto.ids.map((id, order) =>
          this.prisma.status.update({
            where: { id, userId },
            data: { order },
            select: { id: true, name: true },
          }),
        ),
      );
    } catch (error) {
      throw new HttpException(
        `Произошла ошибка обновления порядка статуса проекта!`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
// findOneStatus: Находит уникальный статус задачи по userId и id. Если статус не найден, возвращает null.
//
//   create: Создает новый статус задачи. Проверяет существование проекта, для которого создается статус, и подсчитывает количество существующих статусов, чтобы назначить порядковый номер новому статусу.
//
//   findAll: Возвращает все статусы задач для указанного проекта. Проверяет существование проекта перед поиском статусов.
//
//   findOne: Находит один статус задачи по userId, projectId и id. Проверяет существование проекта перед поиском статуса.
//
//   update: Обновляет статус задачи. Проверяет существование статуса перед обновлением.
//
//   remove: Удаляет статус задачи. Проверяет существование статуса перед удалением.
//
//   updateOrderStatuses: Обновляет порядок статусов задач. Использует транзакцию для обновления порядка нескольких статусов.