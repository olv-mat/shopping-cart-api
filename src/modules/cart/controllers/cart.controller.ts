import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { CartEntity } from '../entities/cart.entity';
import { CartService } from '../services/cart.service';

@Controller('carts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  public async findAll(): Promise<CartEntity[]> {
    return await this.cartService.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  public async findOne(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ) {
    return await this.cartService.findOne(user, uuid);
  }
}
