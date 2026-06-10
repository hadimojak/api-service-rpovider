import { Module } from '@nestjs/common';
import { ClientsModule, Transport, RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService): RmqOptions => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${config.get('RABBITMQ_USER')}:${config.get('RABBITMQ_PASS')}@${config.get('RABBITMQ_HOST')}:${config.get('RABBITMQ_PORT')}`,
            ],
            queue: config.get<string>('RBT_QUEUE_NAME'),
            queueOptions: { durable: true },
            noAck: true,
          },
        }),
      },
    ]),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
