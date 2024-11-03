import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-core';
import { ScraperResponse } from './models/scraper.response';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuthUser } from 'src/auth/auth-user'; // Import AuthUser

@Injectable()
export class ScraperService {
    constructor(
        private readonly configService: ConfigService,
        private prismaService: PrismaService,
    ) { }

    /**
     * Given an array of urls, scrape the media from each url
     * @param urls: Array of urls to scrape
     * @param user: Authenticated user
     * @returns Scraper response array
     */
    async getMediasFromUrls(urls: string[], user: AuthUser): Promise<ScraperResponse[]> {
        const browser = await puppeteer.connect({
            browserWSEndpoint: this.configService.get('WS_ENDPOINT'),
        })

        try {
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(2 * 60 * 1000);

            const allMedias: ScraperResponse[] = [];
            for (const url of urls) {
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
                for (const media of pageMedias) {
                    await this.prismaService.media.create({
                        data: {
                            type: media.type,
                            src: media.src,
                            url: url,
                            userId: user.id, // Associate media with the logged-in user
                        },
                    });
                }

                allMedias.push(...pageMedias);
            }
            return allMedias;
        } catch (error) {
            Logger.error(error);
            throw new Error(error);
        } finally {
            await browser.close();
        }
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

