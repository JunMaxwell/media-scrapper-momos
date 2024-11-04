import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer-core';
import { ScraperResponse } from './models/scraper.response';
import { PrismaService } from '../common/services/prisma.service';
import { AuthUser } from '../auth/auth-user';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

@Injectable()
export class ScraperService {
    constructor(
        @InjectQueue('scraper-queue') private scraperQueue: Queue,
        private readonly configService: ConfigService,
        private prismaService: PrismaService,
    ) { }

    get scraperQueues() {
        return this.scraperQueue;
    }

    /**
     * Queue scraping jobs for an array of urls
     * @param urls: Array of urls to scrape
     * @param user: Authenticated user
     */
    async queueScrapingJobs(urls: string[], user: AuthUser): Promise<Job[]> {
        const batchSize = 100;
        const jobs: Array<Job<any, any, string>> = [];
        Logger.debug(`Queueing scraping jobs for ${urls.length} URLs`);
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            const job = await this.scraperQueue.add('scrape', { urls: batch, userId: user.id }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
            jobs.push(job);
        }
        return jobs;
    }

    /**
     * Scrape media from a single URL
     * @param url: URL to scrape
     * @param userId: ID of the authenticated user
     * @returns Scraper response array
     */
    async scrapeUrl(url: string, userId: number): Promise<ScraperResponse[]> {
        try {
            const browser = await puppeteer.connect({
                browserWSEndpoint: this.configService.get('WS_ENDPOINT'),
            });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            const pageMedias: ScraperResponse[] = await page.evaluate(() => {
                const medias: ScraperResponse[] = [];
                const images = document.querySelectorAll('img');
                const videos = document.querySelectorAll('video');

                images.forEach((img) => {
                    const src = img.src;
                    if (src) {
                        medias.push({ type: 'image', src });
                    }
                });

                videos.forEach((video) => {
                    const src = video.src;
                    if (src) {
                        medias.push({ type: 'video', src });
                    }
                });

                return medias;
            });

            await browser.close();

            await this.saveBatchMedias(pageMedias, url, userId);
            return pageMedias;
        } catch (error) {
            Logger.error(`Error scraping ${url}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Save batch of media to the database
     * @param medias: Array of scraped media
     * @param url: URL of the scraped page
     * @param userId: ID of the authenticated user
     */
    async saveBatchMedias(medias: ScraperResponse[], url: string, userId: number) {
        Logger.debug(`Saving ${medias.length} medias for URL: ${url}`);
        return await this.prismaService.media.createMany({
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
