import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ProviderEntity } from './entities/provider.entity';
import { CreateProviderDto } from '../../common/dto/create-provider.dto';
import { CreateRelustDto } from '../../common/dto/create-result.dto';
import { UUID } from 'crypto';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(ProviderEntity)
    private readonly providerRepo: Repository<ProviderEntity>,
    private readonly httpService: HttpService,
  ) {}

  async excute(providerType: string, endpoint: string, payload?: unknown) {
    const provider = await this.providerRepo.findOne({
      where: {
        type: providerType,
        isActive: true,
      },
      order: { priority: 'ASC' },
    });

    if (!provider)
      throw new NotFoundException(`provider no found: ${providerType}`);

    const response = await firstValueFrom(
      this.httpService.post(`${provider.baseUrl}${endpoint}`, payload, {
        timeout: provider.timeout,

        headers: {
          'x-api-key': provider.apiKey,
        },
      }),
    );

    return response.data;
  }

  async create(createDto: CreateProviderDto): Promise<CreateRelustDto> {
    try {
    const existing = await this.providerRepo.findOneBy({
      code: createDto.code,
    });
    if (existing) {
      throw new ConflictException(
        `Provider with code ${createDto.code} already exists`,
      );
    }

    const provider = this.providerRepo.create(createDto);
    await this.providerRepo.save(provider);
    return { result: { id: <UUID>provider.id } };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
