import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-core';
import { ScraperResponse } from './models/scraper.response';
import { PrismaService } from '../common/services/prisma.service';
import { AuthUser } from '../auth/auth-user';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ScraperService {
    constructor(
        @InjectQueue('scraper-queue') private scraperQueue: Queue,
        private readonly configService: ConfigService,
        private prismaService: PrismaService,
    ) { }

    /**
     * Queue scraping jobs for an array of urls
     * @param urls: Array of urls to scrape
     * @param user: Authenticated user
     */
    async queueScrapingJobs(urls: string[], user: AuthUser): Promise<void> {
        for (const url of urls) {
            await this.scraperQueue.add('scrape', { url, userId: user.id }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
        }
    }

    /**
     * Scrape media from a single URL
     * @param url: URL to scrape
     * @param userId: ID of the authenticated user
     * @returns Scraper response array
     */
    async scrapeUrl(url: string, userId: number): Promise<ScraperResponse[]> {
        const browser = await puppeteer.connect({
            browserWSEndpoint: this.configService.get('WS_ENDPOINT'),
        });

        try {
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(2 * 60 * 1000);

            await page.goto(url, { waitUntil: 'domcontentloaded' });

            const pageMedias: ScraperResponse[] = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('img, video'));
                return elements.map((element) => {
                    if (element instanceof HTMLImageElement) {
                        return {
                            type: 'image',
                            src: element.src,
                        };
                    } else if (element instanceof HTMLVideoElement) {
                        return {
                            type: 'video',
                            src: element.src,
                        };
                    } else {
                        return {
                            type: 'unknown',
                            src: '',
                        };
                    }
                });
            });

            // Save scraped data to the database
            await this.saveBatchMedias(pageMedias, url, userId);

            return pageMedias;
        } catch (error) {
            Logger.error(`Error scraping ${url}: ${error.message}`);
            throw error;
        } finally {
            await browser.close();
        }
    }

    /**
     * Save batch of media to the database
     * @param medias: Array of scraped media
     * @param url: URL of the scraped page
     * @param userId: ID of the authenticated user
     */
    async saveBatchMedias(medias: ScraperResponse[], url: string, userId: number): Promise<void> {
        await this.prismaService.media.createMany({
            data: medias.map(media => ({
                type: media.type,
                src: media.src,
                url: url,
                userId: userId,
            })),
            skipDuplicates: true,
        });
    }

    /**
     * Fetch media of user
     * @param user: Authenticated user
     * @returns Scraper response array
     */
    async fetchMedias(user: AuthUser): Promise<ScraperResponse[]> {
        try {
            const medias = await this.prismaService.media.findMany({
                where: {
                    userId: user.id,
                },
            });

            return medias.map((media) => ({
                type: media.type,
                src: media.src,
            }));
        } catch (error) {
            Logger.error(error);
            throw new Error(error);
        }
    }
}
