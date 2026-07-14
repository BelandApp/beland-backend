// ============================================================================
// user-gift-cards.controller.ts
// ============================================================================

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';


// DTOS
import { CreateUserGiftCardDto } from '../dto/create-user-gift-card.dto';

// RESPONSES
import { UserGiftCardResponseDto } from '../dto/user-gift-card-response.dto';
import { PaginatedUserGiftCardsResponseDto } from '../dto/paginated-user-gift-cards-response.dto';

// USE CASES
import { GetUserGiftCardUseCase } from '../use-cases/get-user-gift-card.use-case';
import { GetMyReceivedGiftCardsUseCase } from '../use-cases/get-my-received-gift-cards.use-case';
import { GetMySentGiftCardsUseCase } from '../use-cases/get-my-sent-gift-cards.use-case';
import { GetUserGiftCardsUseCase } from '../use-cases/get-user-gift-cards.use-case';
import { CancelUserGiftCardUseCase } from '../use-cases/cancel-user-gift-card.use-case';

import { Request } from 'express';
import { PaginationDto } from '../dto/pagination.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/modules/roles/enum/role-validate.enum';
import { PaginatedMySentGiftCardsResponseDto } from '../dto/paginated-my-sent-gift-cards-response.dto';

@ApiTags('User Gift Cards')
@Controller('user-gift-cards')
export class UserGiftCardsController {
  constructor(

    private readonly getUserGiftCardUseCase: GetUserGiftCardUseCase,

    private readonly getMyReceivedGiftCardsUseCase: GetMyReceivedGiftCardsUseCase,

    private readonly getMySentGiftCardsUseCase: GetMySentGiftCardsUseCase,

    private readonly getUserGiftCardsUseCase: GetUserGiftCardsUseCase,

    private readonly cancelUserGiftCardUseCase: CancelUserGiftCardUseCase,

  ) {}

  // ===========================================================================
  // GET ONE
  // ===========================================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get user gift card by id',
  })
  @ApiParam({
    name: 'id',
  })
  @ApiOkResponse({
    type: UserGiftCardResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserGiftCardResponseDto> {
    return this.getUserGiftCardUseCase.execute(
      id, req.user
    );
  }

  // ===========================================================================
  // MY RECEIVED
  // ===========================================================================

  @Get('my/received')
  @ApiOperation({
    summary:
      'Get my received gift cards',
  })
  @ApiOkResponse({
    type:
      PaginatedUserGiftCardsResponseDto,
  })
  async getMyReceived(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
  ): Promise<PaginatedUserGiftCardsResponseDto> {
    return this.getMyReceivedGiftCardsUseCase.execute(
      req.user, paginationDto
    );
  }

  // ===========================================================================
  // MY SENT
  // ===========================================================================

  @Get('my/sent')
  @ApiOperation({
    summary: 'Get my sent gift cards',
  })
  @ApiOkResponse({
    type:
      PaginatedMySentGiftCardsResponseDto,
  })
  async getMySent(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
  ): Promise<PaginatedMySentGiftCardsResponseDto> {
    return this.getMySentGiftCardsUseCase.execute(
      req.user, paginationDto,
    );
  }

  // ===========================================================================
  // GET ALL
  // ===========================================================================

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({
    summary:
      'Get paginated user gift cards',
  })
  @ApiOkResponse({
    type:
      PaginatedUserGiftCardsResponseDto,
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedUserGiftCardsResponseDto> {
    return this.getUserGiftCardsUseCase.execute(
      paginationDto,
    );
  }

  // ===========================================================================
  // CANCEL
  // ===========================================================================

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({
    summary: 'Cancel gift card',
  })
  async cancel(
    @Param('id') id: string,
  ): Promise<UserGiftCardResponseDto> {
    return this.cancelUserGiftCardUseCase.execute(
      id,
    );
  }

}