import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamAuthGuard } from './teams.guard';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [TeamsController],
  providers: [TeamsService, TeamAuthGuard],
  exports: [TeamsService, TeamAuthGuard],
})
export class TeamsModule {}
