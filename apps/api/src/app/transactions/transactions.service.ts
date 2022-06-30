import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma, Transaction } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private prisma: PrismaService, @Inject(REQUEST) private readonly request: Request) {}

  findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId: this.request.user['id'] },
    });
  }

  findOne(where: Prisma.TransactionWhereUniqueInput): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where });
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const data: Prisma.TransactionCreateInput = {
      date: new Date(createTransactionDto.date),
      amount: new Prisma.Decimal(createTransactionDto.amount),
      description: createTransactionDto.description,
      user: {
        connect: { id: this.request.user['id'] },
      },
      account: { connect: { id: createTransactionDto.accountId } },
    };
    try {
      return await this.prisma.transaction.create({ data });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Error saving new transaction: ${error.message}`);
        }
      }
      throw new HttpException(`Error saving new transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const data: Prisma.TransactionUpdateInput = {
      date: new Date(updateTransactionDto.date),
      amount: new Prisma.Decimal(updateTransactionDto.amount),
      description: updateTransactionDto.description,
      account: { connect: { id: updateTransactionDto.accountId } },
      category: { connect: { id: updateTransactionDto.categoryId } },
    };
    // update category id if specifed, otherwise disconnect
    if (updateTransactionDto.categoryId) {
      data.category = { connect: { id: updateTransactionDto.categoryId } };
    } else {
      data.category = { disconnect: true };
    }

    try {
      return await this.prisma.transaction.update({ data, where: { id } });
    } catch (error) {
      this.logger.error(error);
      // if (error instanceof Prisma.PrismaClientKnownRequestError) {  }
      throw new HttpException(`Error updating transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(where: Prisma.TransactionWhereUniqueInput): Promise<Transaction> {
    return this.prisma.transaction.delete({ where });
  }
}
