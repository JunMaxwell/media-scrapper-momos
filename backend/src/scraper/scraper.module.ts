import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { PrismaModule } from '../common/services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
