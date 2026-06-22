export interface UpdateOptions {
    account?: string;
    configPath?: string;
    statePath?: string;
    timezone?: string;
    descriptionTemplate?: string;
    shortDescriptionTemplate?: string;
    dryRun?: boolean;
}
export interface UsageWindow {
    leftPercent: number;
    usedPercent: number;
    resetAt: string;
}
export interface UpdateResult {
    ok: boolean;
    dryRun: boolean;
    account: string;
    updatedAt: string;
    description: string;
    shortDescription: string;
    fiveHour: UsageWindow;
    week: UsageWindow;
    statePath?: string;
}
export declare function updateTelegramUsageStatus(options?: UpdateOptions): Promise<UpdateResult>;
