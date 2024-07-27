import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findOneProject(userId?: string, id?: string) {
    return this.prisma.project.findUnique({ where: { userId, id } });
  }

  async create(userId: string, dto: ProjectDto) {
    try {
      return await this.prisma.project.create({
        data: { name: dto.name, description: dto.description, userId },
        select: { id: true, name: true, description: true, createdAt: true },
      });
    } catch (error) {
      throw new HttpException(
        `Произошла ошибка создания проекта! ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(id: string) {
    const project = await this.prisma.project.findMany({
      where: { userId: id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        statuses: {
          select: {
            id: true,
            name: true,
            tasks: {
              select: {
                id: true,
                createdAt: true,
                name: true,
                description: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      //include: { statuses: { include: { tasks: true } } },
    });
    if (!project)
      throw new HttpException(
        `Произошла ошибка получения проектов!`,
        HttpStatus.NOT_FOUND,
      );
    return project;
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { userId, id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        statuses: {
          select: {
            id: true,
            name: true,
            tasks: {
              select: {
                id: true,
                createdAt: true,
                name: true,
                description: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!project)
      throw new HttpException(
        `Произошла ошибка получения проекта!`,
        HttpStatus.NOT_FOUND,
      );
    return project;
  }

  async update(userId: string, id: string, dto: ProjectDto) {
    const project = await this.findOneProject(userId, id);
    if (!project)
      throw new HttpException(
        `Произошла ошибка получения проекта!`,
        HttpStatus.NOT_FOUND,
      );
    return this.prisma.project.update({
      where: { id, userId },
      data: { name: dto.name, description: dto.description, userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        statuses: {
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
        },
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const project = await this.findOneProject(userId, id);
    if (!project)
      throw new HttpException(
        `Произошла ошибка получения проекта!`,
        HttpStatus.NOT_FOUND,
      );
    await this.prisma.project.delete({ where: { id, userId } });
    return { message: 'Проект успешно удален!' };
  }
}
// constructor(private prisma: PrismaService) {}: Конструктор класса, который инжектирует сервис PrismaService для взаимодействия с базой данных.
//
//   async findOneProject(userId?: string, id?: string): Метод для поиска одного проекта по userId и id. Возвращает уникальный проект или null.
//
//   async create(userId: string, dto: ProjectDto): Метод для создания нового проекта с использованием данных из ProjectDto. В случае ошибки выбрасывает исключение HttpException.
//
//   async findAll(id: string): Метод для получения всех проектов пользователя по userId. Возвращает массив проектов или выбрасывает исключение HttpException, если проекты не найдены.
//
//   async findOne(userId: string, id: string): Метод для поиска одного проекта по userId и id. Возвращает проект с деталями статусов и задач или выбрасывает исключение HttpException, если проект не найден.
//
//   async update(userId: string, id: string, dto: ProjectDto): Метод для обновления проекта. Проверяет существование проекта и обновляет его данные, иначе выбрасывает исключение HttpException.
//
//   async remove(userId: string, id: string): Promise<{ message: string }>:
// Метод для удаления проекта. Проверяет существование проекта и удаляет его, возвращая сообщение об успешном удалении, иначе выбрасывает исключение HttpException.