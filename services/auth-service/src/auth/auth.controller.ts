import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, ValidateTokenResponseDto } from './dto/response.dto';
import { Role } from '../../../../shared/types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    console.log('Auth Controller - Register DTO:', JSON.stringify(registerDto));
    console.log('Auth Controller - Role received:', registerDto.role, typeof registerDto.role);
    
    // Ensure role is valid
    if (!registerDto.role) {
      registerDto.role = Role.ADMIN; // Default to ADMIN if not provided
      console.log('Auth Controller - Setting default role:', registerDto.role);
    }
    
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    type: ValidateTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing token',
  })
  async validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);
    return this.authService.validateToken(token);
  }
}