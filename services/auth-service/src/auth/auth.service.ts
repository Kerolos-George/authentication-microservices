import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtUtils } from '../../../../shared/utils/jwt.utils';
import { HttpService } from '../../../../shared/utils/http.utils';
import { LoginResponse } from '../../../../shared/types';
import { Role } from '../../../../shared/types/user.types';

@Injectable()
export class AuthService {
  private userServiceHttp: HttpService;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.userServiceHttp = new HttpService(process.env.USER_SERVICE_URL|| 'http://localhost:3002');
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      // Create user through User Service
      console.log('Auth Service - Role before sending:', role, typeof role);
      const response = await this.userServiceHttp.post('/users', {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      const user = response.data;
      console.log('Auth Service - User received back:', user);
      console.log('Auth Service - Role received back:', user.role, typeof user.role);

      // Generate JWT
      const payload = JwtUtils.createPayload(user);
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as Role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      if (error.response?.status === 409) {
        throw new ConflictException('User already exists');
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Get user from database
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT
    const payload = JwtUtils.createPayload(user);
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName|| undefined,
        lastName: user.lastName|| undefined,
        role: user.role as Role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}