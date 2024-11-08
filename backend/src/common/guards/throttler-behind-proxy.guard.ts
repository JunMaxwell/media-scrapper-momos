import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const ip = requestIp.getClientIp(req as unknown as requestIp.Request) ?? 'null-ip';
    return Promise.resolve(ip);
  }
}
