import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// DTOs
import { CreateGiftCardDto } from '../dto/create-gift-card.dto';
import { UpdateGiftCardDto } from '../dto/update-gift-card.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';

// RESPONSES
import { GiftCardResponseDto } from '../dto/gift-card-response.dto';
import { PaginatedGiftCardsResponseDto } from '../dto/paginated-gift-cards-response.dto';

// USE CASES
import { CreateGiftCardUseCase } from '../use-cases/create-gift-card.use-case';
import { UpdateGiftCardUseCase } from '../use-cases/update-gift-card.use-case';
import { DeleteGiftCardUseCase } from '../use-cases/delete-gift-card.use-case';
import { GetGiftCardUseCase } from '../use-cases/get-gift-card.use-case';
import { GetGiftCardsUseCase } from '../use-cases/get-gift-cards.use-case';
import { ToggleGiftCardStatusUseCase } from '../use-cases/toggle-gift-card-status.use-case';

// GUARDS
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@ApiTags('Gift Cards')
@Controller('gift-cards')
@UseGuards(FlexibleAuthGuard)
export class GiftCardsController {
  constructor(
    private readonly createGiftCardUseCase: CreateGiftCardUseCase,
    private readonly updateGiftCardUseCase: UpdateGiftCardUseCase,
    private readonly deleteGiftCardUseCase: DeleteGiftCardUseCase,
    private readonly getGiftCardUseCase: GetGiftCardUseCase,
    private readonly getGiftCardsUseCase: GetGiftCardsUseCase,
    private readonly toggleGiftCardStatusUseCase: ToggleGiftCardStatusUseCase,
  ) {}

  // ===========================================================================
  // CREATE
  // ===========================================================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Create gift card template',
  })
  @ApiCreatedResponse({
    type: GiftCardResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
  })
  async create(
    @Body() dto: CreateGiftCardDto,
  ): Promise<GiftCardResponseDto> {
    return this.createGiftCardUseCase.execute(dto);
  }

  // ===========================================================================
  // GET ALL
  // ===========================================================================

  @Get()
  @ApiOperation({
    summary: 'Get paginated gift card templates',
  })
  @ApiOkResponse({
    type: PaginatedGiftCardsResponseDto,
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedGiftCardsResponseDto> {
    return this.getGiftCardsUseCase.execute(paginationDto);
  }

  // ===========================================================================
  // GET ONE
  // ===========================================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get gift card template by id',
  })
  @ApiParam({name: 'id',type: String})
  @ApiOkResponse({
    type: GiftCardResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Gift card not found',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<GiftCardResponseDto> {
    return this.getGiftCardUseCase.execute(id);
  }

  // ===========================================================================
  // UPDATE
  // ===========================================================================

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Update gift card template',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    type: GiftCardResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGiftCardDto,
  ): Promise<GiftCardResponseDto> {
    return this.updateGiftCardUseCase.execute(id, dto);
  }

  // ===========================================================================
  // DELETE
  // ===========================================================================

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Delete gift card template',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiNoContentResponse({
    description: 'Gift card deleted',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteGiftCardUseCase.execute(id);
  }

  // ===========================================================================
  // TOGGLE STATUS
  // ===========================================================================

  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Toggle gift card active status',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    type: GiftCardResponseDto,
  })
  async toggleStatus(
    @Param('id') id: string,
  ): Promise<GiftCardResponseDto> {
    return this.toggleGiftCardStatusUseCase.execute(id);
  }
}