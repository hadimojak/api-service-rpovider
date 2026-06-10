import { Injectable } from '@nestjs/common';
import { config, AppConfig } from './config.constant';

@Injectable()
export class ConfigService {
  //make it static
  public readonly config: AppConfig = config;
}
