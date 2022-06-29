import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);

  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    this.logger.debug('[findAll]');
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.debug('[findOne]');
    return this.accountsService.findOne({ id: +id });
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    this.logger.debug('[create]');
    return this.accountsService.create(createAccountDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    this.logger.debug('[update]');
    if (+id !== updateAccountDto.id) {
      throw new BadRequestException(`The ID in URL doesn't match ID in body`);
    }

    const account = await this.accountsService.findOne({ id: +id });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug('[remove]');
    return this.accountsService.remove({ id: +id });
  }
}
