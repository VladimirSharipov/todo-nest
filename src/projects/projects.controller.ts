import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateProjectsResponse, ProjectsResponse } from 'types/projects.types';
import { DeleteMessage } from 'types/IBase';

@ApiTags('Проекты')
@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @ApiBody({ type: ProjectDto })
  @ApiOkResponse({ type: CreateProjectsResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@CurrentUser('id') id: string, @Body() dto: ProjectDto) {
    return this.projectsService.create(id, dto);
  }

  @ApiOkResponse({ type: [ProjectsResponse] })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@CurrentUser('id') id: string) {
    return this.projectsService.findAll(id);
  }

  @ApiOkResponse({ type: ProjectsResponse })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.projectsService.findOne(userId, id);
  }

  @ApiBody({ type: ProjectDto })
  @ApiOkResponse({ type: CreateProjectsResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ProjectDto,
  ) {
    return this.projectsService.update(userId, id, dto);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.projectsService.remove(userId, id);
  }
}
// create: Создает новый проект, используя данные, полученные из ProjectDto. Возвращает результат работы метода create из сервиса ProjectsService.
//
//   findAll: Возвращает список всех проектов для текущего пользователя. Использует метод findAll из сервиса ProjectsService.
//
//   findOne: Возвращает данные одного проекта по его идентификатору. Использует метод findOne из сервиса ProjectsService.
//
//   update: Обновляет данные проекта, используя информацию из ProjectDto. Возвращает результат работы метода update из сервиса ProjectsService.
//
//   remove: Удаляет проект по его идентификатору. Возвращает сообщение об успешном удалении от метода remove из сервиса ProjectsService.