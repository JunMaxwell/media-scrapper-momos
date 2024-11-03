import { Controller } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Post, Body } from '@nestjs/common';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post('urls')
  async scrapeMediasFromUrls(@Body('urls') urls: string[]) {
    try {
      return await this.scraperService.getMediasFromUrls(urls);
    } catch (error) {
      return new Error(error);
    }
  }
}
