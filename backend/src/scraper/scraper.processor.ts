import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ScraperService } from './scraper.service';

@Processor('scraper-queue')
export class ScraperProcessor {
    private readonly logger = new Logger(ScraperProcessor.name);

    constructor(private readonly scraperService: ScraperService) {}

    @Process({
        name: 'scrape',
        concurrency: 5, // Process 5 jobs simultaneously
    })
    async handleScrape(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
        const { url, userId } = job.data;
        
        try {
            await this.scraperService.scrapeUrl(url, userId);
            this.logger.debug(`Completed job ${job.id} for URL: ${url}`);
        } catch (error) {
            this.logger.error(`Failed job ${job.id} for URL: ${url}. Error: ${error.message}`);
            throw error; // Rethrow to trigger Bull's retry mechanism
        }
    }
}