import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

// CONTROLLERS
import { GiftCardsController } from './controllers/gift-card.controller'; 

// ENTITIES
import { GiftCard } from './entities/gift-card.entity';
import { UserGiftCard } from './entities/user-giftcard.entity'; 

// SERVICES
import { GiftCardValidationService } from './services/gift-card-validation.service';
import { GiftCardMapperService } from './services/gift-card-mapper.service';
import { GiftCardBalanceService } from './services/gift-card-balance.service';

// USE CASES
import { CreateGiftCardUseCase } from './use-cases/create-gift-card.use-case';
import { UpdateGiftCardUseCase } from './use-cases/update-gift-card.use-case';
import { DeleteGiftCardUseCase } from './use-cases/delete-gift-card.use-case';
import { GetGiftCardUseCase } from './use-cases/get-gift-card.use-case';
import { GetGiftCardsUseCase } from './use-cases/get-gift-cards.use-case';
import { ToggleGiftCardStatusUseCase } from './use-cases/toggle-gift-card-status.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GiftCard,
      UserGiftCard,
    ]),
  ],

  controllers: [
    GiftCardsController,
  ],

  providers: [
    // =========================================================================
    // SERVICES
    // =========================================================================

    GiftCardValidationService,
    GiftCardMapperService,
    GiftCardBalanceService,

    // =========================================================================
    // USE CASES
    // =========================================================================

    CreateGiftCardUseCase,
    UpdateGiftCardUseCase,
    DeleteGiftCardUseCase,
    GetGiftCardUseCase,
    GetGiftCardsUseCase,
    ToggleGiftCardStatusUseCase,
  ],

  exports: [
    // =========================================================================
    // SERVICES
    // =========================================================================

    GiftCardValidationService,
    GiftCardMapperService,
    GiftCardBalanceService,

    // =========================================================================
    // USE CASES
    // =========================================================================

    CreateGiftCardUseCase,
    UpdateGiftCardUseCase,
    DeleteGiftCardUseCase,
    GetGiftCardUseCase,
    GetGiftCardsUseCase,
    ToggleGiftCardStatusUseCase,
  ],
})
export class GiftCardModule {}