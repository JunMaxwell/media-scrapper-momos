import { OnQueueEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScraperService } from './scraper.service';
import * as v8 from 'v8';

@Processor('scraper-queue')
export class ScraperProcessor extends WorkerHost {
    private readonly logger = new Logger(ScraperProcessor.name);
    private isProcessingPaused = false;

    constructor(private readonly scraperService: ScraperService) {
        super();
    }

    private checkMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // Convert to MB
        const heapTotal = v8.getHeapStatistics().heap_size_limit / 1024 / 1024; // Convert to MB
        const memoryUsagePercentage = (heapUsed / heapTotal) * 100;

        if (memoryUsagePercentage > 80) {
            // If memory usage is above 80%, pause processing
            this.isProcessingPaused = true;
            this.logger.warn('Memory usage high. Pausing processing for 1 minute.');
            setTimeout(() => {
                this.isProcessingPaused = false;
                this.logger.log('Resuming processing after memory usage pause.');
            }, 60000); // Resume after 1 minute
        }
    }

    async process(job: Job) {
        if (this.isProcessingPaused) {
            this.logger.warn('Processing paused. Skipping job.');
            return;
        }

        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);

        this.checkMemoryUsage();
        switch (job.name) {
            case 'scrape':
                await this.handleScrape(job);
                break;
            default:
                this.logger.error(`Unknown job type: ${job.name}`);
        }
    }

    async handleScrape(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
        const { urls, userId } = job.data;

        try {
            for (const url of urls) {
                await this.scraperService.scrapeUrl(url, userId);
                this.logger.debug(`Completed scraping for URL: ${url}`);
            }
            this.logger.debug(`Completed job ${job.id}`);
        } catch (error) {
            this.logger.error(`Failed job ${job.id}. Error: ${error.message}`);
            throw error;
        }
    }

    @OnQueueEvent('waiting')
    onJobWaiting(jobId: number | string) {
        this.logger.log(`Job ${jobId} is waiting to be processed`);
    }

    @OnQueueEvent('active')
    onJobActive(job: Job) {
        this.logger.log(`Job ${job.id} has started processing`);
    }

    @OnQueueEvent('completed')
    onJobCompleted(job: Job) {
        this.logger.log(`Job ${job.id} has been completed`);
    }

    @OnQueueEvent('failed')
    onJobFailed(job: Job, err: Error) {
        this.logger.error(`Job ${job.id} has failed with error: ${err.message}`);
    }

    @OnQueueEvent('stalled')
    onJobStalled(job: Job) {
        this.logger.warn(`Job ${job.id} has stalled`);
    }
}