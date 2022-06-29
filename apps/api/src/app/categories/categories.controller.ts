import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    this.logger.debug('[findAll]');
    return this.categoriesService.findAll();
  }

  @Get('trees')
  findTrees() {
    this.logger.debug('[findTrees]');
    return this.categoriesService.findAllTrees();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.debug('[findOne]');
    return this.categoriesService.findOne({ id: +id });
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.debug('[create]');
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    this.logger.debug('[update]');
    if (+id !== updateCategoryDto.id) {
      throw new BadRequestException(`The ID in URL doesn't match ID in body`);
    }

    const category = await this.categoriesService.findOne({ id: +id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug('[remove]');
    return this.categoriesService.remove({ id: +id });
  }
}
