import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../../../shared/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    console.log('User Service - DTO before create:', createUserDto);
    console.log('User Service - Role before create:', createUserDto.role, typeof createUserDto.role);
    
    // Determine the correct role value
    let roleValue;
    
    if (typeof createUserDto.role === 'string') {
      // Case-insensitive comparison for string values
      const roleUpper = createUserDto.role.toUpperCase();
      if (roleUpper === 'ADMIN') {
        roleValue = Role.ADMIN;
      } else {
        roleValue = Role.USER;
      }
      console.log('User Service - String role converted to:', roleValue);
    } else if (createUserDto.role) {
      // If it's already an enum value
      roleValue = createUserDto.role;
      console.log('User Service - Enum role:', roleValue);
    } else {
      // Default to ADMIN if no role provided
      roleValue = Role.ADMIN;
      console.log('User Service - Default role:', roleValue);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: roleValue,
        },
      });

      console.log('User Service - Created user with role:', user.role, typeof user.role);

      // Return user without password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.error('User Service - Error creating user:', error);
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  async updateRole(id: string, role: Role) {
    return this.update(id, { role });
  }
}
