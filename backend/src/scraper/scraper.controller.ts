import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthUser } from 'src/auth/auth-user';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('urls')
  async scrapeMediasFromUrls(@Body('urls') urls: string[], @Req() req: Request) {
    const user = req.user as AuthUser;
    try {
      return await this.scraperService.getMediasFromUrls(urls, user);
    } catch (error) {
      return new Error(error);
    }
  }
}
