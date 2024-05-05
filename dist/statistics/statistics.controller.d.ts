import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getAnalyticsOverview(req: any): Promise<{
        message: string;
        data: {
            totalCoupons: any;
            pendingCoupons: any;
            redeemedCoupons: any;
            expiredCoupons: any;
        };
    }>;
}
