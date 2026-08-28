import { Controller, Get, Query, Req, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  private readonly logger = new Logger(FeedController.name);

  constructor(private readonly feedService: FeedService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener el feed de productos con metadata social.' })
  @ApiResponse({ status: 200, description: 'Feed obtenido exitosamente.' })
  async getFeed(@Query() query: FeedQueryDto, @Req() req: Request) {
    const userId = (req as any).user?.id || null;
    this.logger.log(`GET /feed: Solicitado por usuario: ${userId ? userId : 'Anónimo'}`);
    
    return this.feedService.getFeed(userId, query);
  }
}
