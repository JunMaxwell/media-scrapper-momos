import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { PrismaModule } from '../common/services/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { ScraperProcessor } from './scraper.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'scraper-queue',
      prefix: 'scraper',
    }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService, ScraperProcessor],
})
export class ScraperModule { }
