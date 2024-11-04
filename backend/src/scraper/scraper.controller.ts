import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthUser } from 'src/auth/auth-user';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Throttle({
    default: {
      limit: 60,
      ttl: 1000,
    }
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('urls')
  async scrapeMediasFromUrls(@Body('urls') urls: string[], @Req() req: Request) {
    const user = req.user as AuthUser;
    await this.scraperService.queueScrapingJobs(urls, user);
    return { message: 'Scraping jobs queued' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('medias')
  async getMedias(@Req() req: Request) {
    const user = req.user as AuthUser;
    try {
      return await this.scraperService.fetchMedias(user);
    } catch (error) {
      return new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('queue-status')
  async getQueueStatus() {
    const [jobCounts, workers] = await Promise.all([
      this.scraperService.scraperQueues.getJobCounts(),
      this.scraperService.scraperQueues.getWorkers(),
    ]);

    return {
      jobCounts,
      activeWorkers: workers.length,
    };
  }

}