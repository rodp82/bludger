import { Inject, Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Account, Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(private prisma: PrismaService, @Inject(REQUEST) private readonly request: Request) {}

  findAll(): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId: this.request.user['id'] },
    });
  }

  findOne(where: Prisma.AccountWhereUniqueInput): Promise<Account | null> {
    return this.prisma.account.findUnique({ where });
  }

  async create(account: CreateAccountDto): Promise<Account> {
    const data: Prisma.AccountCreateInput = {
      ...account,
      user: {
        connect: { id: this.request.user['id'] },
      },
    };
    try {
      return await this.prisma.account.create({ data });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('This account name already exists');
        }
      }
      throw new HttpException(`Error saving new account: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, account: UpdateAccountDto): Promise<Account> {
    const data: Prisma.AccountUpdateInput = {
      name: account.name,
      balance: account.balance,
      type: account.type,
      user: {
        connect: { id: this.request.user['id'] },
      },
    };
    try {
      return await this.prisma.account.update({ data, where: { id } });
    } catch (error) {
      this.logger.error(error);
      // if (error instanceof Prisma.PrismaClientKnownRequestError) {  }
      throw new HttpException(`Error saving new account: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(where: Prisma.AccountWhereUniqueInput): Promise<Account> {
    return this.prisma.account.delete({ where });
  }
}
