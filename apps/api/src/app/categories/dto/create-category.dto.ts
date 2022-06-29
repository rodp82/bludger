import { Category, CategoryType } from '@bludger/api-interfaces';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto implements Category {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly type: CategoryType;

  @IsNotEmpty()
  @IsNumber()
  readonly parentId: number;
}
