import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, IsNull } from 'typeorm';

import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';

import { Wallet } from '../../wallets/entities/wallet.entity';

import { GiftCard } from 'src/modules/gift-card/entities/gift-card.entity'; 
import { UserGiftCard } from 'src/modules/gift-card/entities/user-giftcard.entity'; 

import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';

import { TransactionCode } from '../../transaction-type/enum/transaction-code';
import { UserGiftCardStatus } from 'src/modules/gift-card/enums/giftcard-status.enum'; 

import { PaymentProviderEnum } from 'src/modules/transactions/enums/transaction.enums';

export interface PurchaseGiftCardUseCaseInput {
  manager: EntityManager;

  giftCardId: string;

  buyerWalletId: string;

  recipientWalletId: string;

  paymentProvider: PaymentProviderEnum;

  paymentReferenceId: string;

  reference?: string;
}

@Injectable()
export class PurchaseGiftCardUseCase {
  constructor(
    private readonly walletPaymentService: WalletPaymentService,
    private readonly superadminConfig: SuperadminConfigService,
  ) {}

  async execute(
    input: PurchaseGiftCardUseCaseInput,
  ): Promise<UserGiftCard> {
    const {
      manager,
      giftCardId,
      buyerWalletId,
      recipientWalletId,
      paymentProvider,
      paymentReferenceId,
      reference,
    } = input;

    // =========================================================================
    // GIFT CARD
    // =========================================================================

    const giftCard = await manager.findOne(GiftCard, {
      where: {
        id: giftCardId,
        deleted_at: IsNull(),
        is_active: true,
      },
    });

    if (!giftCard) {
      throw new NotFoundException(
        'Gift card not found',
      );
    }

    // =========================================================================
    // BUYER WALLET
    // =========================================================================

    const buyerWallet = await manager.findOne(Wallet, {
      where: {
        id: buyerWalletId,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!buyerWallet) {
      throw new NotFoundException(
        'Buyer wallet not found',
      );
    }

    // =========================================================================
    // RECIPIENT WALLET
    // =========================================================================

    const recipientWallet = await manager.findOne(Wallet, {
      where: {
        id: recipientWalletId,
      },
      relations: {
        user: true,
      },
    });

    if (!recipientWallet) {
      throw new NotFoundException(
        'Recipient wallet not found',
      );
    }

    if (buyerWallet.id === recipientWallet.id) {
      throw new BadRequestException(
        'You cannot send a gift card to yourself',
      );
    }

    // =========================================================================
    // STATUS COMPLETED
    // =========================================================================

    const completedStatus =
      await manager.findOne(TransactionState, {
        where: {
          code: 'COMPLETED',
        },
      });

    if (!completedStatus) {
      throw new ConflictException(
        'COMPLETED state not found',
      );
    }

    // =========================================================================
    // TRANSACTION TYPE
    // =========================================================================

    const type = await manager.findOne(TransactionType, {
      where: {
        code: TransactionCode.GIFTCARD_SEND,
      },
    });

    if (!type) {
      throw new ConflictException('PURCHASE_GIFTCARD type not found');
    }

    // =========================================================================
    // SUPERADMIN WALLET
    // =========================================================================

    const superAdminWallet =
      await manager.findOne(Wallet, {
        where: {
          id: this.superadminConfig.getWalletId(),
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

    if (!superAdminWallet) {
      throw new InternalServerErrorException(
        'Superadmin wallet not found',
      );
    }

    // =========================================================================
    // INTERNAL WALLET DEBIT
    // =========================================================================

    if (paymentProvider === PaymentProviderEnum.WALLET) {
      await this.walletPaymentService.processPayment(
        manager,
        buyerWallet.id,
        Number(giftCard.amount),
        {
          type_id: type.id,
          status_id: completedStatus.id,
          reference: reference ?? `GIFTCARD-${giftCard.id}`,
          external_provider: paymentProvider,
          external_reference_id: paymentReferenceId,
        },
      );
    }

    // =========================================================================
    // CREDIT SUPERADMIN
    // =========================================================================

    superAdminWallet.usd_balance =
      Number(superAdminWallet.usd_balance) +
      Number(giftCard.amount);

    await manager.save(
      Wallet,
      superAdminWallet,
    );

    // =========================================================================
    // TRANSACTION
    // =========================================================================

    await manager.save(Transaction, {
      wallet_id: superAdminWallet.id,

      type_id: type.id,

      status_id: completedStatus.id,

      amount_usd: Number(giftCard.amount),

      post_balance:
        superAdminWallet.usd_balance,

      reference:
        reference ??
        `GIFTCARD-${giftCard.id}`,

      external_provider:
        paymentProvider,

      external_reference_id:
        paymentReferenceId,
    });

    // =========================================================================
    // EXPIRATION
    // =========================================================================

    let expiresAt: Date | null = null;

    if (giftCard.expiration_days) {
      expiresAt = new Date();

      expiresAt.setDate(
        expiresAt.getDate() +
          giftCard.expiration_days,
      );
    }

    // =========================================================================
    // CREATE USER GIFT CARD
    // =========================================================================

    const userGiftCard = await manager.save(
      UserGiftCard,
      {
        gift_card_id: giftCard.id,

        sender_user_id:
          buyerWallet.user_id,

        recipient_wallet_id:
          recipientWallet.id,

        original_balance:
          giftCard.amount,

        current_balance:
          giftCard.amount,

        expires_at: expiresAt,

        is_active: true,

        status:
          UserGiftCardStatus.ACTIVE,
      },
    );

    // =========================================================================
    // INCREMENT SOLD
    // =========================================================================

    await manager.increment(
      GiftCard,
      {
        id: giftCard.id,
      },
      'sold_quantity',
      1,
    );

    return userGiftCard;
  }
}