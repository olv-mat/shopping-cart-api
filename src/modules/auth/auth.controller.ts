import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { UserRoles } from '../user/enums/user-roles.enum';
import { AuthFacade } from './auth.facade';
import { Roles } from './decorators/roles.decorator';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerCreated()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authFacade.register(dto, false);
  }

  @Post('register/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new admin user' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public registerAdmin(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authFacade.register(dto, true);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authFacade.login(dto);
  }
}
