import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/prisma.service';
import { RabbitMQService } from 'src/rabbitmq.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RabbitMQService],
})
export class TasksModule {}
