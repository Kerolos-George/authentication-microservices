import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional ,ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../../shared/types';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'USER',
    enum: Role,
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: true,
    description: 'User active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    enum: Role,
    description: 'New role for the user',
  })
  @IsEnum(Role)
  role: Role;
}
