import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import {
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { UserRoles } from '../user/enums/user-roles.enum';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dtos/Login.dto';
import { LoginResponseDto } from './dtos/LoginResponse.dto';
import { RegisterDto } from './dtos/Register.dto';
import { RegisterResponseDto } from './dtos/RegisterResponse.dto';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerCreated()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public async register(
    @Body() dto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(dto, false);
  }

  @Post('register/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Register a new admin user' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public async registerAdmin(
    @Body() dto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(dto, true);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
