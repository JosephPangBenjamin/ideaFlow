import { Module } from '@nestjs/common';
import { CanvasesService } from './canvases.service';
import { CanvasesController } from './canvases.controller';
import { SharesService } from './shares/shares.service';
import { SharesController } from './shares/shares.controller';
import { SharedCanvasesController } from './shares/shared-canvases.controller';
import { ShareAuthGuard } from './guards/share-auth.guard';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CanvasesController, SharesController, SharedCanvasesController],
  providers: [CanvasesService, SharesService, ShareAuthGuard],
  exports: [CanvasesService, SharesService],
})
export class CanvasesModule {}
