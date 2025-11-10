import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  endpointProperties,
  endpointResponses,
} from 'src/common/utils/swagger-properties';
import { UserRoles } from '../user/enums/user-roles.enum';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dtos/Login.dto';
import { LoginResponseDto } from './dtos/LoginResponse.dto';
import { RegisterDto } from './dtos/Register.dto';
import { RegisterResponseDto } from './dtos/RegisterResponse.dto';
import { RolesGuard } from './guards/roles.guard';

const properties = endpointProperties.auth;
const responses = endpointResponses;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation(properties.register)
  @ApiResponse(responses.internalServerError)
  public async register(
    @Body() dto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(dto, false);
  }

  @Post('register/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation(properties.registerAdmin)
  @ApiResponse(responses.internalServerError)
  public async registerAdmin(@Body() dto: RegisterDto) {
    return this.authService.register(dto, true);
  }

  @Post('login')
  @ApiOperation(properties.login)
  @ApiResponse(responses.internalServerError)
  public async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
