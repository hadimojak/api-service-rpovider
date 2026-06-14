import { Body, Controller, Post } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from '../../common/dto/create-provider.dto';
import { CreateRelustDto } from '../../common/dto/create-result.dto';

@Controller('admin/provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<CreateRelustDto | Error> {
    return this.providerService.create(createProviderDto);
  }
}
