import { Module } from '@nestjs/common';
import { CanvasesService } from './canvases.service';
import { CanvasesController } from './canvases.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CanvasesController],
  providers: [CanvasesService],
  exports: [CanvasesService],
})
export class CanvasesModule {}
