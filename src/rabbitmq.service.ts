import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queue = process.env.RABBITMQ_QUEUE;

  async onModuleInit() {
    await this.connectToRabbitMQ();
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private async connectToRabbitMQ() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  async sendMessageToQueue(message: string) {
    try {
      this.channel.sendToQueue(this.queue, Buffer.from(message), {
        persistent: true,
      });
    } catch (error) {
      console.error('Failed to send message to RabbitMQ', error);
    }
  }
}
