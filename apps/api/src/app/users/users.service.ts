import { Injectable, Logger } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { Provider, User as IUser } from '@bludger/api-interfaces'

import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: id,
    });
  }

  findOneByThirdPartyId(thirdPartyId: string, provider: Provider): Promise<User | null> {
    const where: Prisma.UserWhereUniqueInput = {};
    if (provider === Provider.GOOGLE) {
      where.googleId = thirdPartyId
    }
    return this.findOne(where);
  }

  async registerOAuthUser(thirdPartyId: string, provider: Provider, data: IUser): Promise<User> {
    this.logger.debug('[registerOAuthUser]');
    // check to see if user already exists with same email
    const existingUser = await this.findOne({email: data.email})
    if (!existingUser) {
      this.logger.debug('User does not exist, create new one');
      // no user found, create new one
      const newUser = new CreateUserDto()
      newUser.name = data.name
      newUser.email = data.email
      switch (provider) {
        case Provider.GOOGLE:
          newUser.googleId = thirdPartyId
          break;
        default:
          throw new Error(`Unknown Provider (${provider}) specified`);
      }
      try {
        await validate(newUser);
        return this.create(newUser);
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      // existing user found, link account
      this.logger.debug('User exists, update with third party id');
      switch (provider) {
        case Provider.GOOGLE:
          existingUser.googleId = thirdPartyId
          break;
        default:
          throw new Error(`Unknown Provider (${provider}) specified`);
      }
      return this.update({id: existingUser.id}, existingUser)
    }
    
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      data,
      where,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

}
