import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'clxxx123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName?: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'], description: 'User role' })
  role: string;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: UserDto, description: 'User information' })
  user: UserDto;
}

export class ValidateTokenResponseDto {
  @ApiProperty({ example: 'clxxx123', description: 'User ID' })
  sub: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'], description: 'User role' })
  role: string;

  @ApiProperty({ example: 1640995200, description: 'Token issued at timestamp' })
  iat: number;

  @ApiProperty({ example: 1641081600, description: 'Token expiration timestamp' })
  exp: number;
}
