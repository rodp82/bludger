import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Category, Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService, @Inject(REQUEST) private readonly request: Request) {}

  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId: this.request.user['id'] },
      orderBy: [{ type: 'asc' }, { path: 'asc' }],
    });
  }

  findAllTrees(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { AND: [{ userId: this.request.user['id'] }, { parentId: { equals: null } }] },
      orderBy: [{ type: 'asc' }, { path: 'asc' }],
      include: {
        children: true,
      },
    });
  }

  findOne(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.findUnique({ where });
  }

  async create(category: CreateCategoryDto) {
    const data: Prisma.CategoryCreateInput = {
      ...category,
      order: 0,
      path: '', // TODO
      user: {
        connect: { id: this.request.user['id'] },
      },
    };

    try {
      return await this.prisma.category.create({ data });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('This category name already exists');
        }
      }
      throw new HttpException(`Error saving new category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, category: UpdateCategoryDto) {
    const data: Prisma.CategoryUpdateInput = {
      ...category,
      user: {
        connect: { id: this.request.user['id'] },
      },
    };
    try {
      return await this.prisma.category.update({ data, where: { id } });
    } catch (error) {
      this.logger.error(error);
      // if (error instanceof Prisma.PrismaClientKnownRequestError) {  }
      throw new HttpException(`Error saving new category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({ where });
  }
}
